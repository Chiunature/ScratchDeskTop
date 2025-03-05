const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log = require('../../util/log');
const StageLayering = require('../../engine/stage-layering');
const cameraIcon = require('./camera.svg');
const blocksObj = require('./blocks.js');

/**
/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = cameraIcon;
/**
 * Enum for camera color parameter values.
 * @readonly
 * @enum {string}
 */
const ColorParam = {
    COLOR: 'color',
    SATURATION: 'saturation',
    BRIGHTNESS: 'brightness',
    TRANSPARENCY: 'transparency'
};


/**
 * @typedef {object} cameraState - the camera state associated with a particular target.
 * @property {Boolean} cameraDown - tracks whether the camera should draw for this target.
 * @property {number} color - the current color (hue) of the camera.
 * @property {cameraAttributes} cameraAttributes - cached camera attributes for the renderer. This is the authoritative value for
 *   diameter but not for camera color.
 */

/**
 * Host for the camera-related blocks in NewAI 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class NewAICameraBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The ID of the renderer Drawable corresponding to the camera layer.
         * @type {int}
         * @private
         */
        this._cameraDrawableId = -1;

        /**
         * The ID of the renderer Skin corresponding to the camera layer.
         * @type {int}
         * @private
         */
        this._cameraSkinId = -1;

        this.ports = this._getPorts(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this._onTargetMoved = this._onTargetMoved.bind(this);

        runtime.on('targetWasCreated', this._onTargetCreated);
        runtime.on('RUNTIME_DISPOSED', this.clear.bind(this));
    }

    /**
     * @return {string} - the ID of this extension.
     */
    get EXTENSION_ID () {
        return 'camera';
    }

    /**
     * The default camera state, to be used when a target has no existing camera state.
     * @type {cameraState}
     */
    static get DEFAULT_camera_STATE () {
        return {
            cameraDown: false,
            color: 66.66,
            saturation: 100,
            brightness: 100,
            transparency: 0,
            _shade: 50, // Used only for legacy `change shade by` blocks
            cameraAttributes: {
                color4f: [0, 0, 1, 1],
                diameter: 1
            }
        };
    }


    /**
     * The minimum and maximum allowed camera size.
     * The maximum is twice the diagonal of the stage, so that even an
     * off-stage sprite can fill it.
     * @type {{min: number, max: number}}
     */
    static get camera_SIZE_RANGE () {
        return {min: 1, max: 1200};
    }

    /**
     * The key to load & store a target's camera-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'NewAI.camera';
    }

    _getPorts(info) {
        return info.map((item) => {
            return {
                name: item,
                value: item,
            };
        });
    }

    /**
     * Clamp a camera size value to the range allowed by the camera.
     * @param {number} requestedSize - the requested camera size.
     * @returns {number} the clamped size.
     * @private
     */
    _clampcameraSize (requestedSize) {
        return MathUtil.clamp(
            requestedSize,
            NewAICameraBlocks.camera_SIZE_RANGE.min,
            NewAICameraBlocks.camera_SIZE_RANGE.max
        );
    }

    /**
     * Retrieve the ID of the renderer "Skin" corresponding to the camera layer. If
     * the camera Skin doesn't yet exist, create it.
     * @returns {int} the Skin ID of the camera layer, or -1 on failure.
     * @private
     */
    _getcameraLayerID () {
        if (this._cameraSkinId < 0 && this.runtime.renderer) {
            this._cameraSkinId = this.runtime.renderer.createcameraSkin();
            this._cameraDrawableId = this.runtime.renderer.createDrawable(StageLayering.camera_LAYER);
            this.runtime.renderer.updateDrawableSkinId(this._cameraDrawableId, this._cameraSkinId);
        }
        return this._cameraSkinId;
    }

    /**
     * @param {Target} target - collect camera state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {cameraState} the mutable camera state associated with that target. This will be created if necessary.
     * @private
     */
    _getcameraState (target) {
        let cameraState = target.getCustomState(NewAICameraBlocks.STATE_KEY);
        if (!cameraState) {
            cameraState = Clone.simple(NewAICameraBlocks.DEFAULT_camera_STATE);
            target.setCustomState(NewAICameraBlocks.STATE_KEY, cameraState);
        }
        return cameraState;
    }

    /**
     * When a camera-using Target is cloned, clone the camera state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const cameraState = sourceTarget.getCustomState(NewAICameraBlocks.STATE_KEY);
            if (cameraState) {
                newTarget.setCustomState(NewAICameraBlocks.STATE_KEY, Clone.simple(cameraState));
                if (cameraState.cameraDown) {
                    newTarget.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
                }
            }
        }
    }

    /**
     * Handle a target which has moved. This only fires when the camera is down.
     * @param {RenderedTarget} target - the target which has moved.
     * @param {number} oldX - the previous X position.
     * @param {number} oldY - the previous Y position.
     * @param {boolean} isForce - whether the movement was forced.
     * @private
     */
    _onTargetMoved (target, oldX, oldY, isForce) {
        // Only move the camera if the movement isn't forced (ie. dragged).
        if (!isForce) {
            const cameraSkinId = this._getcameraLayerID();
            if (cameraSkinId >= 0) {
                const cameraState = this._getcameraState(target);
                this.runtime.renderer.cameraLine(cameraSkinId, cameraState.cameraAttributes, oldX, oldY, target.x, target.y);
                this.runtime.requestRedraw();
            }
        }
    }

    /**
     * Wrap a color input into the range (0,100).
     * @param {number} value - the value to be wrapped.
     * @returns {number} the wrapped value.
     * @private
     */
    _wrapColor (value) {
        return MathUtil.wrapClamp(value, 0, 100);
    }

    /**
     * Clamp a camera color parameter to the range (0,100).
     * @param {number} value - the value to be clamped.
     * @returns {number} the clamped value.
     * @private
     */
    _clampColorParam (value) {
        return MathUtil.clamp(value, 0, 100);
    }

    /**
     * Convert an alpha value to a camera transparency value.
     * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
     * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
     * @param {number} alpha - the input alpha value.
     * @returns {number} the transparency value.
     * @private
     */
    _alphaToTransparency (alpha) {
        return (1.0 - alpha) * 100.0;
    }

    /**
     * Convert a camera transparency value to an alpha value.
     * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
     * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
     * @param {number} transparency - the input transparency value.
     * @returns {number} the alpha value.
     * @private
     */
    _transparencyToAlpha (transparency) {
        return 1.0 - (transparency / 100.0);
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array
     * of objects with text and value properties. The text is a translated
     * string, and the value is one-indexed.
     * @param {object[]} info - An array of info objects each having a name
     *   property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'camera',
            name: formatMessage({
                id: 'camera.categoryName',
                default: 'camera',
                description: 'Label for the camera extension category'
            }),
            blockIconURI: blockIconURI,
            blocks: blocksObj,
            menus: {
                camera_menu: {
                    acceptReporters: true,
                    items: this._buildMenu(this.ports)
                }
            }
        };
    }

    /**
     * The camera "clear" block clears the camera layer's contents.
     */
    clear () {
        const cameraSkinId = this._getcameraLayerID();
        if (cameraSkinId >= 0) {
            this.runtime.renderer.cameraClear(cameraSkinId);
            this.runtime.requestRedraw();
        }
    }

    /**
     * The camera "stamp" block stamps the current drawable's image onto the camera layer.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    stamp (args, util) {
        const cameraSkinId = this._getcameraLayerID();
        if (cameraSkinId >= 0) {
            const target = util.target;
            this.runtime.renderer.cameraStamp(cameraSkinId, target.drawableID);
            this.runtime.requestRedraw();
        }
    }

    /**
     * The camera "camera down" block causes the target to leave camera trails on future motion.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    cameraDown (args, util) {
        const target = util.target;
        const cameraState = this._getcameraState(target);

        if (!cameraState.cameraDown) {
            cameraState.cameraDown = true;
            target.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }

        const cameraSkinId = this._getcameraLayerID();
        if (cameraSkinId >= 0) {
            this.runtime.renderer.cameraPoint(cameraSkinId, cameraState.cameraAttributes, target.x, target.y);
            this.runtime.requestRedraw();
        }
    }

    /**
     * The camera "camera up" block stops the target from leaving camera trails.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    cameraUp (args, util) {
        const target = util.target;
        const cameraState = this._getcameraState(target);

        if (cameraState.cameraDown) {
            cameraState.cameraDown = false;
            target.removeListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }
    }

    /**
     * The camera "set camera color to {color}" block sets the camera to a particular RGB color.
     * The transparency is reset to 0.
     * @param {object} args - the block arguments.
     *  @property {int} COLOR - the color to set, expressed as a 24-bit RGB value (0xRRGGBB).
     * @param {object} util - utility object provided by the runtime.
     */
    setcameraColorToColor (args, util) {
        const cameraState = this._getcameraState(util.target);
        const rgb = Cast.toRgbColorObject(args.COLOR);
        const hsv = Color.rgbToHsv(rgb);
        cameraState.color = (hsv.h / 360) * 100;
        cameraState.saturation = hsv.s * 100;
        cameraState.brightness = hsv.v * 100;
        if (rgb.hasOwnProperty('a')) {
            cameraState.transparency = 100 * (1 - (rgb.a / 255.0));
        } else {
            cameraState.transparency = 0;
        }

        // Set the legacy "shade" value the same way NewAI 2 did.
        cameraState._shade = cameraState.brightness / 2;

        this._updatecameraColor(cameraState);
    }

    /**
     * Update the cached color from the color, saturation, brightness and transparency values
     * in the provided cameraState object.
     * @param {cameraState} cameraState - the camera state to update.
     * @private
     */
    _updatecameraColor (cameraState) {
        const rgb = Color.hsvToRgb({
            h: cameraState.color * 360 / 100,
            s: cameraState.saturation / 100,
            v: cameraState.brightness / 100
        });
        cameraState.cameraAttributes.color4f[0] = rgb.r / 255.0;
        cameraState.cameraAttributes.color4f[1] = rgb.g / 255.0;
        cameraState.cameraAttributes.color4f[2] = rgb.b / 255.0;
        cameraState.cameraAttributes.color4f[3] = this._transparencyToAlpha(cameraState.transparency);
    }

    /**
     * Set or change a single color parameter on the camera state, and update the camera color.
     * @param {ColorParam} param - the name of the color parameter to set or change.
     * @param {number} value - the value to set or change the param by.
     * @param {cameraState} cameraState - the camera state to update.
     * @param {boolean} change - if true change param by value, if false set param to value.
     * @private
     */
    _setOrChangeColorParam (param, value, cameraState, change) {
        switch (param) {
        case ColorParam.COLOR:
            cameraState.color = this._wrapColor(value + (change ? cameraState.color : 0));
            break;
        case ColorParam.SATURATION:
            cameraState.saturation = this._clampColorParam(value + (change ? cameraState.saturation : 0));
            break;
        case ColorParam.BRIGHTNESS:
            cameraState.brightness = this._clampColorParam(value + (change ? cameraState.brightness : 0));
            break;
        case ColorParam.TRANSPARENCY:
            cameraState.transparency = this._clampColorParam(value + (change ? cameraState.transparency : 0));
            break;
        default:
            log.warn(`Tried to set or change unknown color parameter: ${param}`);
        }
        this._updatecameraColor(cameraState);
    }

    /**
     * The "change camera {ColorParam} by {number}" block changes one of the camera's color parameters
     * by a given amound.
     * @param {object} args - the block arguments.
     *  @property {ColorParam} COLOR_PARAM - the name of the selected color parameter.
     *  @property {number} VALUE - the amount to change the selected parameter by.
     * @param {object} util - utility object provided by the runtime.
     */
    changecameraColorParamBy (args, util) {
        const cameraState = this._getcameraState(util.target);
        this._setOrChangeColorParam(args.COLOR_PARAM, Cast.toNumber(args.VALUE), cameraState, true);
    }

    /**
     * The "set camera {ColorParam} to {number}" block sets one of the camera's color parameters
     * to a given amound.
     * @param {object} args - the block arguments.
     *  @property {ColorParam} COLOR_PARAM - the name of the selected color parameter.
     *  @property {number} VALUE - the amount to set the selected parameter to.
     * @param {object} util - utility object provided by the runtime.
     */
    setcameraColorParamTo (args, util) {
        const cameraState = this._getcameraState(util.target);
        this._setOrChangeColorParam(args.COLOR_PARAM, Cast.toNumber(args.VALUE), cameraState, false);
    }

    /**
     * The camera "change camera size by {number}" block changes the camera size by the given amount.
     * @param {object} args - the block arguments.
     *  @property {number} SIZE - the amount of desired size change.
     * @param {object} util - utility object provided by the runtime.
     */
    changecameraSizeBy (args, util) {
        const cameraAttributes = this._getcameraState(util.target).cameraAttributes;
        cameraAttributes.diameter = this._clampcameraSize(cameraAttributes.diameter + Cast.toNumber(args.SIZE));
    }

    /**
     * The camera "set camera size to {number}" block sets the camera size to the given amount.
     * @param {object} args - the block arguments.
     *  @property {number} SIZE - the amount of desired size change.
     * @param {object} util - utility object provided by the runtime.
     */
    setcameraSizeTo (args, util) {
        const cameraAttributes = this._getcameraState(util.target).cameraAttributes;
        cameraAttributes.diameter = this._clampcameraSize(Cast.toNumber(args.SIZE));
    }

    /* LEGACY OPCODES */
    /**
     * NewAI 2 "hue" param is equivelant to twice the new "color" param.
     * @param {object} args - the block arguments.
     *  @property {number} HUE - the amount to set the hue to.
     * @param {object} util - utility object provided by the runtime.
     */
    setcameraHueToNumber (args, util) {
        const cameraState = this._getcameraState(util.target);
        const hueValue = Cast.toNumber(args.HUE);
        const colorValue = hueValue / 2;
        this._setOrChangeColorParam(ColorParam.COLOR, colorValue, cameraState, false);
        this._setOrChangeColorParam(ColorParam.TRANSPARENCY, 0, cameraState, false);
        this._legacyUpdatecameraColor(cameraState);
    }

    /**
     * NewAI 2 "hue" param is equivelant to twice the new "color" param.
     * @param {object} args - the block arguments.
     *  @property {number} HUE - the amount of desired hue change.
     * @param {object} util - utility object provided by the runtime.
     */
    changecameraHueBy (args, util) {
        const cameraState = this._getcameraState(util.target);
        const hueChange = Cast.toNumber(args.HUE);
        const colorChange = hueChange / 2;
        this._setOrChangeColorParam(ColorParam.COLOR, colorChange, cameraState, true);

        this._legacyUpdatecameraColor(cameraState);
    }

    /**
     * Use legacy "set shade" code to calculate RGB value for shade,
     * then convert back to HSV and store those components.
     * It is important to also track the given shade in cameraState._shade
     * because it cannot be accurately backed out of the new HSV later.
     * @param {object} args - the block arguments.
     *  @property {number} SHADE - the amount to set the shade to.
     * @param {object} util - utility object provided by the runtime.
     */
    setcameraShadeToNumber (args, util) {
        const cameraState = this._getcameraState(util.target);
        let newShade = Cast.toNumber(args.SHADE);

        // Wrap clamp the new shade value the way NewAI 2 did.
        newShade = newShade % 200;
        if (newShade < 0) newShade += 200;

        // And store the shade that was used to compute this new color for later use.
        cameraState._shade = newShade;

        this._legacyUpdatecameraColor(cameraState);
    }

    /**
     * Because "shade" cannot be backed out of hsv consistently, use the previously
     * stored cameraState._shade to make the shade change.
     * @param {object} args - the block arguments.
     *  @property {number} SHADE - the amount of desired shade change.
     * @param {object} util - utility object provided by the runtime.
     */
    changecameraShadeBy (args, util) {
        const cameraState = this._getcameraState(util.target);
        const shadeChange = Cast.toNumber(args.SHADE);
        this.setcameraShadeToNumber({SHADE: cameraState._shade + shadeChange}, util);
    }

    /**
     * Update the camera state's color from its hue & shade values, NewAI 2.0 style.
     * @param {object} cameraState - update the HSV & RGB values in this camera state from its hue & shade values.
     * @private
     */
    _legacyUpdatecameraColor (cameraState) {
        // Create the new color in RGB using the NewAI 2 "shade" model
        let rgb = Color.hsvToRgb({h: cameraState.color * 360 / 100, s: 1, v: 1});
        const shade = (cameraState._shade > 100) ? 200 - cameraState._shade : cameraState._shade;
        if (shade < 50) {
            rgb = Color.mixRgb(Color.RGB_BLACK, rgb, (10 + shade) / 60);
        } else {
            rgb = Color.mixRgb(rgb, Color.RGB_WHITE, (shade - 50) / 60);
        }

        // Update the camera state according to new color
        const hsv = Color.rgbToHsv(rgb);
        cameraState.color = 100 * hsv.h / 360;
        cameraState.saturation = 100 * hsv.s;
        cameraState.brightness = 100 * hsv.v;

        this._updatecameraColor(cameraState);
    }
}

module.exports = NewAICameraBlocks;
