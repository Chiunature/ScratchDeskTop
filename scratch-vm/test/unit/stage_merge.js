const test = require('tap').test;
const fs = require('fs');
const {
    dedupeSerializedTargets,
    pickDefaultEditingTarget,
    repairProjectJson,
    repairProjectInput
} = require('../../src/util/stage-merge');

test('dedupeSerializedTargets merges duplicate stages and keeps sprites', t => {
    const targets = [
        {isStage: true, name: 'Stage', variables: {}},
        {isStage: false, name: 'Sprite1', variables: {}},
        {isStage: true, name: 'Stage', variables: {a: ['var', 0]}},
        {isStage: false, name: 'Sprite2', variables: {}}
    ];

    const result = dedupeSerializedTargets(targets);

    t.equal(result.length, 3);
    t.equal(result.filter(target => target.isStage).length, 1);
    t.deepEqual(result[0].variables, {a: ['var', 0]});
    t.equal(result[1].name, 'Sprite1');
    t.equal(result[2].name, 'Sprite2');
    t.end();
});

test('pickDefaultEditingTarget prefers sprite with most blocks', t => {
    const targets = [
        {isStage: true, blocks: {_blocks: {}}},
        {isStage: false, name: 'Sprite1', blocks: {_blocks: {a: {}}}},
        {isStage: false, name: 'Sprite2', blocks: {_blocks: {a: {}, b: {}, c: {}}}}
    ];

    t.equal(pickDefaultEditingTarget(targets).name, 'Sprite2');
    t.end();
});

test('repairProjectJson returns null when no duplicate stage exists', t => {
    const json = {
        targets: [
            {isStage: true, name: 'Stage'},
            {isStage: false, name: 'Sprite1'}
        ]
    };

    t.equal(repairProjectJson(json), null);
    t.end();
});

test('repairProjectInput repairs desktop project json string', t => {
    const projectPath = 'c:/Users/Administrator/Desktop/project.json';
    if (!fs.existsSync(projectPath)) {
        t.skip('desktop project fixture not available');
        return t.end();
    }

  return repairProjectInput(fs.readFileSync(projectPath, 'utf8'))
        .then(repaired => {
            const json = JSON.parse(repaired);
            t.equal(json.targets.filter(target => target.isStage).length, 1);
            t.equal(Object.keys(json.targets[0].variables || {}).length, 38);
            t.equal(json.targets.length, 3);
            t.end();
        });
});
