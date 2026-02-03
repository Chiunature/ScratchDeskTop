// import ScratchBlocks from "scratch-blocks";
import { defaultColors } from "./themes";
// 使用运行时路径，而不是 import，避免 webpack 构建时解析错误
const motorIcon = "static/LeftBuildingIcon/generator.svg";
const combinedMotorIcon = "static/LeftBuildingIcon/combination.svg";
const matrixIcon = "static/LeftBuildingIcon/lighting.svg";
const cameraIcon = "static/LeftBuildingIcon/camera.svg";
const voiceIcon = "static/LeftBuildingIcon/voice.svg";
const controlIcon = "static/LeftBuildingIcon/control.svg";
const eventIcon = "static/LeftBuildingIcon/event.svg";
const sensingIcon = "static/LeftBuildingIcon/detect.svg";
const operatorsIcon = "static/LeftBuildingIcon/operation.svg";
const variablesIcon = "static/LeftBuildingIcon/variable.svg";
const myBlocksIcon = "static/LeftBuildingIcon/HomemadeBlocks.svg";

const categorySeparator = '<sep gap="36"/>';

const blockSeparator = '<sep gap="24"/>'; // At default scale, about 28px

const xmlEscape = function (unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            case '"':
                return "&quot;";
        }
    });
};

const motor = function ({ isInitialSetup, isStage, targetId, colors }) {
    return `
            <category
                name="%{BKY_CATEGORY_MOTOR}"
                id="motor"
                colour="${colors.primary}"
                secondaryColour="${colors.tertiary}"
                iconURI="${motorIcon}">
                ${blockSeparator}
                <block type="motor_starting">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="motor_stop">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="motor_specifiedunit">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                    <value name="POWER">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                    <value name="COUNT">
                        <shadow type="math_number"><field name="NUM">1</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="motor_specified_manner">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="motor_startWithPower">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                    <value name="POWER">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
            </category>
            `;
};

const combined_motor = function ({
    isInitialSetup,
    isStage,
    targetId,
    colors,
}) {
    return `
            <category
                name="%{BKY_CATEGORY_COMBINED_MOTOR}"
                id="combined_motor"
                colour="${colors.primary}"
                secondaryColour="${colors.tertiary}"
                iconURI="${combinedMotorIcon}">
                ${blockSeparator}
                <block type="combined_motor_starting">
                    <value name="PORT">
                        <shadow type="combined_motor_box"></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="combined_motor_stop"></block>
                ${blockSeparator}
                <block type="combined_motor_stopping"></block>
                ${blockSeparator}
                <block type="combined_motor_startWithPower">
                    <value name="POWER_ONE">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                    <value name="POWER_TWO">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="combined_motor_startWithPowerObj">
                    <value name="POWER_ONE">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                    <value name="POWER_TWO">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                    <value name="COUNT">
                        <shadow type="math_number"><field name="NUM">1</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="combined_linepatrolInit"></block>
                ${blockSeparator}
                <block type="combined_linepatrol_ltr">
                    <value name="PORT_ONE">
                        <shadow type="math_number" />
                    </value>
                    <value name="PORT_TWO">
                        <shadow type="math_number" />
                    </value>
                    <value name="LEFT">
                        <shadow type="math_number"><field name="NUM">80</field></shadow>
                    </value>
                    <value name="RIGHT">
                        <shadow type="math_number"><field name="NUM">80</field></shadow>
                    </value>
                    <value name="KP">
                        <shadow type="math_number"><field name="NUM">0.1</field></shadow>
                    </value>
                    <value name="KD">
                        <shadow type="math_number"><field name="NUM">0.6</field></shadow>
                    </value>
                </block>
                ${categorySeparator}
            </category>
            `;
};

const matrix = function ({ isInitialSetup, isStage, targetId, colors }) {
    return `
            <category
                name="%{BKY_CATEGORY_MATRIX}"
                id="matrix"
                colour="${colors.primary}"
                secondaryColour="${colors.tertiary}"
                iconURI="${matrixIcon}">
                ${blockSeparator}
                <block type="matrix_lamp">
                </block>
                ${blockSeparator}
                <block type="matrix_lamp_stop"></block>
                ${blockSeparator}
                <block type="matrix_lamp_set"></block>
                ${blockSeparator}
                <block type="matrix_lamp_text">
                    <value name="matrix_text">
                        <shadow type="text">
                            <field name="TEXT">ABCD</field>
                        </shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="matrix_lamp_single">
                    <value name="x">
                        <shadow type="matrix_x"></shadow>
                    </value>
                    <value name="y">
                        <shadow type="matrix_y"></shadow>
                    </value>
                    <value name="brightness">
                        <shadow type="math_0to100_number"><field name="NUM">50</field></shadow>
                    </value>
                </block>
                ${categorySeparator}
            </category>
            `;
};

const sound = function ({
    isInitialSetup,
    isStage,
    targetId,
    soundName,
    colors,
}) {
    return `
    <category name="%{BKY_CATEGORY_SOUND}" id="sound" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}" iconURI="${voiceIcon}">
        <block id="${targetId}_sound_playuntildone" type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
        </block>
        ${blockSeparator}
        <block id="${targetId}_sound_play" type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="sound_stopallsounds"/>
        ${blockSeparator}
        <block type="sound_setvolumeto">
            <value name="VOLUME">
                <shadow type="math_0to100_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="sound_PlayMusic">
            <value name="NOTE">
                <shadow type="piano"></shadow>
            </value>
            <value name="BEATS">
                <shadow type="math_number">
                    <field name="NUM">0.25</field>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const events = function ({ isInitialSetup, isStage, targetId, colors }) {
    return `
            <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="${colors.primary}"
            secondaryColour="${colors.tertiary}" iconURI="${eventIcon}">
                <block type="event_whenflagclicked"/>
                ${blockSeparator}
            </category>
            `;
};

const control = function ({ isInitialSetup, isStage, targetId, colors }) {
    return `
    <category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}" iconURI="${controlIcon}">
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block id="wait_until" type="control_wait_until"/>
        ${blockSeparator}
        <block type="control_break"/>
        ${categorySeparator}
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block id="forever" type="control_forever"/>
        ${blockSeparator}
        <block type="control_if"/>
        ${blockSeparator}
        <block type="control_if_else"/>
        ${blockSeparator}
         <block id="repeat_until" type="control_repeat_until"/>
         ${blockSeparator}
        <block type="control_stop" />
        ${categorySeparator}
    </category>
    `;
};

const sensing = function ({ isInitialSetup, isStage, targetId, colors }) {
    return `
    <category name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="${colors.primary}"
        secondaryColour="${colors.tertiary}" iconURI="${sensingIcon}">
            <block type="sensing_reflected_light_judgment">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
                <value name="value">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_reflected_light_detection">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${categorySeparator}
            <block type="sensing_grayscale_state">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${categorySeparator}
            <block type="sensing_calibrate">
                <value name="PORT1">
                    <shadow type="sensing_menu" />
                </value>
                <value name="PORT2">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${categorySeparator}
            <block type="sensing_ultrasonic_judgment">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
                <value name="value">
                    <shadow type="math_number"><field name="NUM">10</field></shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_ultrasonic_detection">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_key_judgment">
                <value name="PORT">
                    <shadow type="touching_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_isHandling">
                <value name="PORT">
                    <shadow type="handShank_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_mainIsPress"></block>
            ${categorySeparator}
            <block type="sensing_timer"></block>
            ${blockSeparator}
            <block type="sensing_reset_timer"></block>
            ${blockSeparator}
        </category>
    `;
};

const operators = function ({ isInitialSetup, colors }) {
    const apple = "apple";
    const banana = "banana";
    const letter = "a";
    return `
    <category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}" iconURI="${operatorsIcon}">
        <block type="operator_add">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_subtract">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_multiply">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_divide">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
        <block type="operator_gt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_lt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_equals">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
        <block type="operator_and"/>
        ${blockSeparator}
        <block type="operator_or"/>
        ${blockSeparator}
        <block type="operator_not"/>
        ${categorySeparator}
        <block type="operator_contains" id="operator_contains">
              <value name="STRING1">
                <shadow type="text">
                  <field name="TEXT">${apple}</field>
                </shadow>
              </value>
              <value name="STRING2">
                <shadow type="text">
                  <field name="TEXT">${letter}</field>
                </shadow>
              </value>
        </block>
        ${blockSeparator}
        <block type="operator_join">
                <value name="STRING1">
                    <shadow type="text">
                        <field name="TEXT">${apple} </field>
                    </shadow>
                </value>
                <value name="STRING2">
                    <shadow type="text">
                        <field name="TEXT">${banana}</field>
                    </shadow>
                </value>
        </block>
        ${blockSeparator}
        <block type="operator_letter_of">
                <value name="LETTER">
                    <shadow type="math_whole_number">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
                <value name="STRING">
                    <shadow type="text">
                        <field name="TEXT">${apple}</field>
                    </shadow>
                </value>
        </block>
        ${blockSeparator}
        <block type="operator_length">
                <value name="STRING">
                    <shadow type="text">
                        <field name="TEXT">${apple}</field>
                    </shadow>
                </value>
        </block>
        ${categorySeparator}
        <block type="operator_mod">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_round">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_mathop">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_random">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const variables = function ({ colors }) {
    return `
    <category
        name="%{BKY_CATEGORY_VARIABLES}"
        id="variables"
        colour="${colors.primary}"
        secondaryColour="${colors.tertiary}"
        custom="VARIABLE"
        iconURI="${variablesIcon}">
    </category>
    `;
};

const myBlocks = function ({ colors }) {
    return `
    <category
        name="%{BKY_CATEGORY_MYBLOCKS}"
        id="myBlocks"
        colour="${colors.primary}"
        secondaryColour="${colors.tertiary}"
        custom="PROCEDURE"
        iconURI="${myBlocksIcon}">
    </category>
    `;
};

const cameraRecognition = function ({ colors }) {
    return `
    <category name="%{BKY_CATEGORY_CAMERA_RECOGNITION}" id="cameraRecognition" colour="${colors.primary}"
        secondaryColour="${colors.tertiary}" iconURI="${cameraIcon}">
        ${categorySeparator}
        ${blockSeparator}
        <block type="cameraRecognition_set_mode_apriltagtag_mode">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_discerrn_aprltag_lab">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_apriltaglab_id">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_apriltaglab_x_point">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_apriltaglab_y_point">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_apriltaglab_angle">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_apriltaglab_cm">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_set_mode_featurepoint_detection">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_find_match_target">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_match_target">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_target_angle">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_set_mode_face_recognition">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_discern_face">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_face_x_point">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_face_y_point">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_set_mode_line_patrol">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_find_black_line">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_line_offset_angle">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_line_offset_cm">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_line_segment_promient">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_set_mode_color_detection">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_follow_block">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_follow_block_size">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_follow_x_point">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_follow_y_point">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_color_blue">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}        
        <block type="cameraRecognition_color_gread">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_color_read">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_set_find_color_mode">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_find_color">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_cmp_color">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
        </block>
        ${categorySeparator}
        <block type="cameraRecognition_set_color_block_mode">
            <value name="PORT">
                <shadow type="cameraRecognition_menu" />
            </value>
            <value name="COLOR_R">
                <shadow type="math_number" />
            </value>
            <value name="COLOR_G">
                <shadow type="math_number" />
            </value>
            <value name="COLOR_B">
                <shadow type="math_number" />
            </value>
            <value name="COLOR_PRECENT">
                <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

/* eslint-enable no-unused-vars */

const xmlOpen = '<xml style="display: none">';
const xmlClose = "</xml>";

/**
 * @param {!boolean} isInitialSetup - Whether the toolbox is for initial setup. If the mode is "initial setup",
 * blocks with localized default parameters (e.g. ask and wait) should not be loaded. (LLK/scratch-gui#5445)
 * @param {?boolean} isStage - Whether the toolbox is for a stage-type target. This is always set to true
 * when isInitialSetup is true.
 * @param {?string} targetId - The current editing target
 * @param {?Array.<object>} categoriesXML - optional array of `{id,xml}` for categories. This can include both core
 * and other extensions: core extensions will be placed in the normal Scratch order; others will go at the bottom.
 * @property {string} id - the extension / category ID.
 * @property {string} xml - the `<category>...</category>` XML for this extension / category.
 * @param {?string} costumeName - The name of the default selected costume dropdown.
 * @param {?string} backdropName - The name of the default selected backdrop dropdown.
 * @param {?string} soundName -  The name of the default selected sound dropdown.
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
const makeToolboxXML = function (
    isInitialSetup,
    isStage = true,
    targetId,
    categoriesXML = [],
    costumeName = "",
    backdropName = "",
    soundName = "",
    colors = defaultColors
) {
    isStage = isInitialSetup || isStage;
    const gap = [categorySeparator];

    costumeName = xmlEscape(costumeName);
    backdropName = xmlEscape(backdropName);
    soundName = xmlEscape(soundName);

    categoriesXML = categoriesXML.slice();
    const moveCategory = (categoryId) => {
        const index = categoriesXML.findIndex(
            (categoryInfo) => categoryInfo.id === categoryId
        );
        if (index >= 0) {
            // remove the category from categoriesXML and return its XML
            const [categoryInfo] = categoriesXML.splice(index, 1);
            return categoryInfo.xml;
        }
        // return `undefined`
    };
    const motorXML =
        moveCategory("motor") ||
        motor({ isInitialSetup, isStage, targetId, colors: colors.motor });
    const combined_motorXML =
        moveCategory("combined_motor") ||
        combined_motor({
            isInitialSetup,
            isStage,
            targetId,
            colors: colors.combined_motor,
        });
    const matrixXML =
        moveCategory("matrix") ||
        matrix({ isInitialSetup, isStage, targetId, colors: colors.matrix });
    const soundXML =
        moveCategory("sound") ||
        sound({
            isInitialSetup,
            isStage,
            targetId,
            soundName,
            colors: colors.sounds,
        });
    const eventsXML =
        moveCategory("event") ||
        events({ isInitialSetup, isStage, targetId, colors: colors.event });
    const controlXML =
        moveCategory("control") ||
        control({ isInitialSetup, isStage, targetId, colors: colors.control });
    // 在 sensing_cameraXML 之后添加
    const cameraRecognitionXML =
        moveCategory("cameraRecognition") ||
        cameraRecognition({ colors: colors.cameraRecognition });
    const sensingXML =
        moveCategory("sensing") ||
        sensing({ isInitialSetup, isStage, targetId, colors: colors.sensing });
    const operatorsXML =
        moveCategory("operators") ||
        operators({ isInitialSetup, colors: colors.operators });
    const variablesXML =
        moveCategory("data") || variables({ colors: colors.data });
    const myBlocksXML =
        moveCategory("procedures") || myBlocks({ colors: colors.more });
    const everything = [
        xmlOpen,
        motorXML,
        gap,
        combined_motorXML,
        gap,
        matrixXML,
        gap,
        // soundXML,
        // gap,
        eventsXML,
        gap,
        controlXML,
        gap,
        sensingXML,
        // gap,
        // cameraRecognitionXML,
        gap,
        operatorsXML,
        gap,
        variablesXML,
        gap,
        myBlocksXML,
    ];

    for (const extensionCategory of categoriesXML) {
        everything.push(gap, extensionCategory.xml);
    }

    everything.push(xmlClose);
    return everything.join("\n");
};

export default makeToolboxXML;
