const Clone = require('./clone');
const log = require('./log');
const JSZip = require('jszip');

/**
 * Score a serialized stage target by how much project data it holds.
 * @param {object} stage Serialized stage target.
 * @return {number}
 */
const scoreSerializedStage = stage =>
    Object.keys(stage.variables || {}).length +
    Object.keys(stage.lists || {}).length +
    Object.keys(stage.blocks || {}).length +
    Object.keys(stage.comments || {}).length;

/**
 * Score a runtime stage target by how much project data it holds.
 * @param {object} stage Runtime target.
 * @return {number}
 */
const scoreRuntimeStage = stage =>
    Object.keys(stage.variables || {}).length +
    Object.keys(stage.blocks._blocks || {}).length +
    Object.keys(stage.comments || {}).length;

/**
 * Count blocks on a runtime target.
 * @param {object} target Runtime target.
 * @return {number}
 */
const countRuntimeBlocks = target =>
    Object.keys(target.blocks._blocks || {}).length;

/**
 * Pick which target should be active in the editor after loading a project.
 * Prefer the sprite that contains the most blocks (main program), not the
 * first sprite in the list (often an empty default sprite).
 * @param {Array<object>} targets Installed runtime targets.
 * @return {object|null}
 */
const pickDefaultEditingTarget = targets => {
    if (!targets || targets.length === 0) return null;

    const sprites = targets.filter(target => !target.isStage);
    if (sprites.length === 0) {
        return targets.find(target => target.isStage) || targets[0];
    }

    return sprites.reduce((best, current) =>
        (countRuntimeBlocks(current) > countRuntimeBlocks(best) ? current : best)
    );
};

/**
 * Stable layer-order sort that always keeps the stage first.
 * @param {object} a Serialized target.
 * @param {object} b Serialized target.
 * @return {number}
 */
const compareSerializedTargetLayerOrder = (a, b) => {
    if (a.isStage && !b.isStage) return -1;
    if (!a.isStage && b.isStage) return 1;
    const aLayer = typeof a.layerOrder === 'number' ? a.layerOrder : Number.MAX_SAFE_INTEGER;
    const bLayer = typeof b.layerOrder === 'number' ? b.layerOrder : Number.MAX_SAFE_INTEGER;
    return aLayer - bLayer;
};

/**
 * Merge serialized stage targets into a single valid stage object.
 * @param {Array<object>} stages Serialized stage targets.
 * @return {object|null}
 */
const mergeSerializedStages = stages => {
    if (stages.length === 0) return null;
    if (stages.length === 1) {
        const stage = Object.assign({}, stages[0]);
        stage.isStage = true;
        stage.name = 'Stage';
        return stage;
    }

    const sorted = stages.slice().sort(
        (a, b) => scoreSerializedStage(b) - scoreSerializedStage(a)
    );
    const primary = Object.assign({}, sorted[0]);
    primary.isStage = true;
    primary.name = 'Stage';

    const stageLayerOrders = stages
        .map(stage => stage.layerOrder)
        .filter(order => typeof order === 'number');
    if (stageLayerOrders.length > 0) {
        primary.layerOrder = Math.min(...stageLayerOrders);
    } else {
        primary.layerOrder = 0;
    }

    for (let i = 1; i < sorted.length; i++) {
        const other = sorted[i];
        primary.variables = Object.assign({}, other.variables || {}, primary.variables || {});
        primary.lists = Object.assign({}, other.lists || {}, primary.lists || {});
        primary.broadcasts = Object.assign({}, other.broadcasts || {}, primary.broadcasts || {});
        primary.blocks = Object.assign({}, other.blocks || {}, primary.blocks || {});
        primary.comments = Object.assign({}, other.comments || {}, primary.comments || {});

        if (primary.tempo === undefined && other.tempo !== undefined) primary.tempo = other.tempo;
        if (primary.videoTransparency === undefined && other.videoTransparency !== undefined) {
            primary.videoTransparency = other.videoTransparency;
        }
        if (primary.videoState === undefined && other.videoState !== undefined) {
            primary.videoState = other.videoState;
        }
        if (primary.textToSpeechLanguage === undefined && other.textToSpeechLanguage !== undefined) {
            primary.textToSpeechLanguage = other.textToSpeechLanguage;
        }
        if (primary.volume === undefined && other.volume !== undefined) primary.volume = other.volume;
    }

    return primary;
};

/**
 * Ensure serialized target lists contain at most one stage.
 * @param {Array<object>} targets Serialized targets.
 * @return {Array<object>}
 */
const dedupeSerializedTargets = targets => {
    const stages = targets.filter(target => target.isStage);
    const sprites = targets.filter(target => !target.isStage);
    if (stages.length <= 1) return targets;

    log.warn(`Project contained ${stages.length} stage targets; merging into one.`);
    return [mergeSerializedStages(stages)].concat(sprites);
};

/**
 * Merge one runtime stage target into another.
 * @param {object} primary Stage target that will be kept.
 * @param {object} secondary Stage target whose data will be merged in.
 */
const mergeRuntimeStages = (primary, secondary) => {
    if (!primary || !secondary || primary === secondary) return;

    for (const id in secondary.variables) {
        if (!primary.variables[id]) {
            primary.variables[id] = secondary.variables[id];
        }
    }

    for (const id in secondary.comments) {
        if (!primary.comments[id]) {
            primary.comments[id] = secondary.comments[id];
        }
    }

    for (const blockId in secondary.blocks._blocks) {
        if (!primary.blocks._blocks[blockId]) {
            const block = Clone.simple(secondary.blocks._blocks[blockId]);
            block.targetId = null;
            primary.blocks.createBlock(block);
        }
    }

    if (primary.tempo === undefined && secondary.tempo !== undefined) primary.tempo = secondary.tempo;
    if (primary.videoTransparency === undefined && secondary.videoTransparency !== undefined) {
        primary.videoTransparency = secondary.videoTransparency;
    }
    if (primary.videoState === undefined && secondary.videoState !== undefined) {
        primary.videoState = secondary.videoState;
    }
    if (primary.textToSpeechLanguage === undefined && secondary.textToSpeechLanguage !== undefined) {
        primary.textToSpeechLanguage = secondary.textToSpeechLanguage;
    }
    if (primary.volume === undefined && secondary.volume !== undefined) primary.volume = secondary.volume;
};

/**
 * Pick the runtime stage target that should be treated as canonical.
 * @param {Array<object>} stages Runtime stage targets.
 * @return {object}
 */
const pickPrimaryRuntimeStage = stages => stages.slice().sort(
    (a, b) => scoreRuntimeStage(b) - scoreRuntimeStage(a)
)[0];

/**
 * Merge duplicate runtime stage targets and dispose extras.
 * @param {object} runtime VM runtime.
 */
const consolidateRuntimeStages = runtime => {
    const stages = runtime.targets.filter(
        target => target.isOriginal && target.isStage
    );
    if (stages.length <= 1) return;

    log.warn(`Runtime contained ${stages.length} stage targets; merging into one.`);
    const primary = pickPrimaryRuntimeStage(stages);

    for (const stage of stages) {
        if (stage === primary) continue;
        mergeRuntimeStages(primary, stage);
        runtime.disposeTarget(stage);
    }
};

/**
 * Merge incoming install targets so only one stage is installed.
 * @param {object} vm Virtual machine instance.
 * @param {Array<object>} targets Targets about to be installed.
 * @return {Array<object>}
 */
const normalizeTargetsForInstall = (vm, targets) => {
    const existingStage = vm.runtime.getTargetForStage();
    const incomingStages = [];
    const incomingSprites = [];

    targets.forEach(target => {
        if (target.isStage) incomingStages.push(target);
        else incomingSprites.push(target);
    });

    if (existingStage && incomingStages.length > 0) {
        incomingStages.forEach(stage => mergeRuntimeStages(existingStage, stage));
        return incomingSprites;
    }

    if (incomingStages.length > 1) {
        const primary = pickPrimaryRuntimeStage(incomingStages);
        incomingStages.forEach(stage => {
            if (stage !== primary) mergeRuntimeStages(primary, stage);
        });
        return [primary].concat(incomingSprites);
    }

    return incomingStages.concat(incomingSprites);
};

/**
 * Repair duplicate stage targets inside parsed project JSON.
 * @param {object} json Parsed project JSON.
 * @return {object|null} Repaired JSON, or null if no repair was needed.
 */
const repairProjectJson = json => {
    if (!json || !Array.isArray(json.targets)) return null;
    const stageCount = json.targets.filter(target => target.isStage).length;
    if (stageCount <= 1) return null;

    const repaired = Object.assign({}, json);
    repaired.targets = dedupeSerializedTargets(json.targets);
    return repaired;
};

/**
 * Attempt to repair project input that contains duplicate stage targets.
 * @param {string|ArrayBuffer|Uint8Array} input Project file input.
 * @return {Promise<string|ArrayBuffer|Uint8Array>} Repaired input when possible.
 */
const repairProjectInput = input => {
    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed.startsWith('{')) return Promise.resolve(input);
        try {
            const repaired = repairProjectJson(JSON.parse(trimmed));
            return Promise.resolve(repaired ? JSON.stringify(repaired) : input);
        } catch (repairError) {
            return Promise.resolve(input);
        }
    }

    if (input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
        const buffer = input instanceof ArrayBuffer ?
            input :
            input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
        return JSZip.loadAsync(buffer)
            .then(zip => {
                const projectFile = zip.file('project.json');
                if (!projectFile) return input;
                return projectFile.async('string').then(projectText => {
                    const repaired = repairProjectJson(JSON.parse(projectText));
                    if (!repaired) return input;
                    zip.file('project.json', JSON.stringify(repaired));
                    return zip.generateAsync({type: 'arraybuffer'});
                });
            })
            .catch(() => input);
    }

    return Promise.resolve(input);
};

module.exports = {
    dedupeSerializedTargets,
    mergeSerializedStages,
    mergeRuntimeStages,
    consolidateRuntimeStages,
    normalizeTargetsForInstall,
    pickDefaultEditingTarget,
    compareSerializedTargetLayerOrder,
    repairProjectJson,
    repairProjectInput
};
