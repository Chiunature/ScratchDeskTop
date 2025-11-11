// import ScratchBlocks from "scratch-blocks";
import { defaultColors } from "./themes";
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

/*
    <block type="motor_specifiedangle">
            <value name="ANGLE">
                <shadow type="math_angle"></shadow>
            </value>
        </block>
        <block type="motor_relative_position"></block>
        <block type="motor_acceleration">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                    <value name="P">
                        <shadow type="math_number"><field name="NUM">1</field></shadow>
                    </value>
                    <value name="I">
                        <shadow type="math_number"><field name="NUM">0.1</field></shadow>
                    </value>
                    <value name="D">
                        <shadow type="math_number"><field name="NUM">0.1</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="motor_setStill">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                    <value name="P">
                        <shadow type="math_number"><field name="NUM">1</field></shadow>
                    </value>
                    <value name="I">
                        <shadow type="math_number"><field name="NUM">0.1</field></shadow>
                    </value>
                    <value name="D">
                        <shadow type="math_number"><field name="NUM">0.1</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
    */

const motor = function ({ isInitialSetup, isStage, targetId, colors }) {
    /* const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        "MOTOR_STAGE_SELECTED",
        "Stage selected: no motor blocks"
    ); */
    return `
            <category
                name="%{BKY_CATEGORY_MOTOR}"
                id="motor"
                colour="${colors.primary}"
                secondaryColour="${colors.tertiary}">
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
                <block type="motor_speed">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                    <value name="SPEED">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="motor_specifiedunit">
                    <value name="PORT">
                        <shadow type="motor_box"></shadow>
                    </value>
                    <value name="COUNT">
                        <shadow type="math_number"><field name="NUM">1</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="motor_specified_manner">
                    <value name="PORT">
                        <shadow type="motor_box_abef"></shadow>
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

{
    /* <block type="combined_motor_move">
                    <value name="left">
                        <shadow type="math_-100to100_number"></shadow>
                    </value>
                    <value name="right">
                        <shadow type="math_-100to100_number"></shadow>
                    </value>
                </block>
                <block type="combined_motor_turn">
                    <value name="PORT1">
                        <shadow type="combined_motorOne_menu"></shadow>
                    </value>
                    <value name="PORT2">
                        <shadow type="combined_motorTwo_menu"></shadow>
                    </value>
                    <value name="ANGLE">
                        <shadow type="math_angle"></shadow>
                    </value>
                </block>
                <block type="combined_motor_angle">
                    <value name="ANGLE">
                        <shadow type="math_angle"></shadow>
                    </value>
                </block>
        */
}
const combined_motor = function ({
    isInitialSetup,
    isStage,
    targetId,
    colors,
}) {
    /* const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        "MOTOR_STAGE_SELECTED",
        "Stage selected: no combined_motor blocks"
    ); */
    return `
            <category
                name="%{BKY_CATEGORY_COMBINED_MOTOR}"
                id="combined_motor"
                colour="${colors.primary}"
                secondaryColour="${colors.tertiary}">
                ${blockSeparator}
                <block type="combined_motor_starting">
                    <value name="PORT">
                        <shadow type="combined_motor_box"></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="combined_motor_direction"></block>
                ${blockSeparator}
                <block type="combined_motor_speed">
                    <value name="SPEED">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="combined_motor_speed_two">
                    <value name="SPEED_FIRST">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                    <value name="SPEED_SECOND">
                        <shadow type="math_-100to100_number"><field name="NUM">50</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="combined_motor_line">
                    <value name="distance">
                        <shadow type="math_number"><field name="NUM">1</field></shadow>
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
            </category>
            `;
};

/*
    <block type="matrix_lamp_setSaturation">
            <value name="saturation">
                <shadow type="math_0to100_number"><field name="NUM">50</field></shadow>
            </value>
        </block>
        <block type="matrix_lamp_setColorRGB">
            <value name="R">
                <shadow type="math_0to255_number"/>
            </value>
            <value name="G">
                <shadow type="math_0to255_number"/>
            </value>
            <value name="B">
                <shadow type="math_0to255_number"/>
            </value>
        </block>
*/
const matrix = function ({ isInitialSetup, isStage, targetId, colors }) {
    /* const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        "MOTOR_STAGE_SELECTED",
        "Stage selected: no matrix blocks"
    ); */
    return `
            <category
                name="%{BKY_CATEGORY_MATRIX}"
                id="matrix"
                colour="${colors.primary}"
                secondaryColour="${colors.tertiary}">
                ${blockSeparator}
                <block type="matrix_lamp">
                    <value name="COLOR">
                        <shadow type="colour_picker"/>
                    </value>
                </block>
                ${blockSeparator}
                <block type="matrix_lamp_stop"></block>
                ${blockSeparator}
                <block type="matrix_lamp_set">
                    <value name="brightness">
                        <shadow type="math_0to100_number"><field name="NUM">50</field></shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="matrix_lamp_text">
                    <value name="matrix_text">
                        <shadow type="text">
                            <field name="TEXT">ABCD</field>
                        </shadow>
                    </value>
                </block>
                ${blockSeparator}
                <block type="matrix_color">
                    <value name="COLOR">
                        <shadow type="colour_picker"/>
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

{
    /*
    <block type="sound_cleareffects"/>
    <block type="sound_changeeffectby">
                <value name="VALUE">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
            </block>
            <block type="sound_seteffectto">
                <value name="VALUE">
                    <shadow type="math_number">
                        <field name="NUM">100</field>
                    </shadow>
                </value>
            </block>
            <block type="sound_changevolumeby">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">-10</field>
                </shadow>
            </value>
        </block>
            ${blockSeparator}
            <block type="sound_setPlaySpeed">
            <value name="SPEED">
                <shadow type="math_number">
                    <field name="NUM">60</field>
                </shadow>
            </value>
        </block>
*/
}
const sound = function ({
    isInitialSetup,
    isStage,
    targetId,
    soundName,
    colors,
}) {
    return `
    <category name="%{BKY_CATEGORY_SOUND}" id="sound" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}">
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

{
    /* <block type="event_checkcolor">
            <value name="COLOR">
                <shadow type="colour_picker"/>
            </value>
        </block>
        <block type="event_keyjudement" />
        <block type="event_tilts" />
        <block type="event_keypress" />
        ${blockSeparator}

        ${blockSeparator}
        <block type="event_whengreaterthan">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="event_when"/>
            <value name="BROADCAST_INPUT">
                    <shadow type="event_broadcast_menu"></shadow>
                </value>
        ${categorySeparator}
*/
}
const events = function ({ isInitialSetup, isStage, targetId, colors }) {
    return `
            <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="${colors.primary}"
            secondaryColour="${colors.tertiary}">
                <block type="event_whenflagclicked"/>
                ${blockSeparator}
            </category>
            `;
};

const control = function ({ isInitialSetup, isStage, targetId, colors }) {
    return `
    <category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}">
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
{
    /*
    <block type="sensing_line_inspection_judgment"></block>
    <block type="sensing_magnetic_calibration"></block>
    <block type="sensing_compass"></block>
    <block type="sensing_timer"></block>
    <block type="sensing_reset_timer"></block>
    ${blockSeparator}
    <block id="loudness" type="sensing_loudness"/>
    ${blockSeparator}
    <block id="current" type="sensing_current"/>
    <block type="sensing_dayssince2000"/>
    <block type="sensing_magnetism"></block>
    <block type="sensing_key_press"></block>
            <block type="sensing_HSVColor">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
                <value name="COLOR">
                    <shadow type="colour_card" />
                </value>
                <value name="Min">
                    <shadow type="math_0to255_number"><field name="NUM">0</field></shadow>
                </value>
                 <value name="Max">
                    <shadow type="math_0to255_number"><field name="NUM">255</field></shadow>
                </value>
            </block>
        <block type="sensing_reflected_light_blackLine">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
                <value name="THRESHOLD">
                    <shadow type="math_number"><field name="NUM">100</field></shadow>
                </value>
        </block>
        ${blockSeparator}
    */
}
const sensing = function ({ isInitialSetup, isStage, targetId, colors }) {
    /* const name = ScratchBlocks.ScratchMsgs.translate(
        "SENSING_ASK_TEXT",
        "What's your name?"
    ); */
    return `
    <category name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="${colors.primary}"
        secondaryColour="${colors.tertiary}">
            <block type="sensing_color_judgment">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
                <value name="COLOR">
                    <shadow type="colour_card" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_color_range">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
                <value name="RMin">
                    <shadow type="math_0to255_number"><field name="NUM">0</field></shadow>
                </value>
                <value name="RMax">
                    <shadow type="math_0to255_number"><field name="NUM">255</field></shadow>
                </value>
                 <value name="GMin">
                    <shadow type="math_0to255_number"><field name="NUM">0</field></shadow>
                </value>
                <value name="GMax">
                    <shadow type="math_0to255_number"><field name="NUM">255</field></shadow>
                </value>
                <value name="BMin">
                    <shadow type="math_0to255_number"><field name="NUM">0</field></shadow>
                </value>
                 <value name="BMax">
                    <shadow type="math_0to255_number"><field name="NUM">255</field></shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_color_detection">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_color_detectionRGB">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${categorySeparator}
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
            <block type="sensing_sound_intensity"></block>
            ${categorySeparator}
            <block type="sensing_gyroscope_attitude"></block>
            ${blockSeparator}
            <block type="sensing_gyroscope_acceleration"></block>
            ${categorySeparator}
            <block type="sensing_key_judgment">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_isHandling"></block>
            ${blockSeparator}
            <block type="sensing_Handling"></block>
            ${blockSeparator}
            <block type="sensing_mainIsPress"></block>
            ${categorySeparator}
            <block type="sensing_gyroscope_angle"></block>
            ${blockSeparator}
            <block type="sensing_set_yaw_angle"></block>
            ${categorySeparator}
            <block type="sensing_timer"></block>
            ${blockSeparator}
            <block type="sensing_reset_timer"></block>
            ${blockSeparator}
            <block type="sensing_get_gray_line">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_get_gray_lineState">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_judgelineState">
                <value name="PORT">
                    <shadow type="sensing_menu" />
                </value>
                <value name="STATEUS">
                    <shadow type="math_number" />
                </value>
            </block>
            ${categorySeparator}
        </category>
    `;
};

const operators = function ({ isInitialSetup, colors }) {
    const apple = "apple";
    const banana = "banana";
    const letter = "a";
    return `
    <category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}">
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
        custom="VARIABLE">
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
        custom="PROCEDURE">
    </category>
    `;
};

const sensing_camera = function ({ colors }) {
    return `
    <category name="%{BKY_CATEGORY_SENSING_CAMERA}" id="sensing_camera" colour="${colors.primary}"
        secondaryColour="${colors.tertiary}">
        ${categorySeparator}
            ${blockSeparator}
             <block type="sensing_camera_find_color_block">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
                <value name="R">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
                <value name="G">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
                <value name="B">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
                <value name="TOLERANCE">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_find_color_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_find_color_block_x">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value></block>
            ${blockSeparator}
            <block type="sensing_camera_find_color_block_y">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value></block>
            ${blockSeparator}
            <block type="sensing_camera_find_color_pixel">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value></block>
            ${blockSeparator}
            <block type="sensing_camera_middle_find">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
                <value name="RADIUS">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
                <value name="R">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
                <value name="G">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
                <value name="B">
                    <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_middle_find_red">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value></block>
            ${blockSeparator}
            <block type="sensing_camera_middle_find_green">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value></block>
            ${blockSeparator}
            <block type="sensing_camera_middle_find_blue">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value></block>
            ${blockSeparator}
            <block type="sensing_camera_extern_color">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_extern_red">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_extern_green">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_extern_blue">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_find_line">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_find_line_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_find_line_showsex">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_find_line_rho">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_find_line_theta">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_number_check">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_number_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_get_number">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_check">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_x">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_y">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_trace">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_trace_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_trace_x">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_face_trace_y">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_qr_check">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_qr_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_apriltag">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_apriltag_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_apriltag_id">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_apriltag_x">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_apriltag_y">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_apriltag_roll">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_apriltag_distance">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_characteristic">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_characteristic_state">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_characteristic_matchine">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_camera_characteristic_roll">
                <value name="PORT">
                    <shadow type="sensing_camera_menu" />
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
    // const sensing_cameraXML = moveCategory("sensing_camera") || sensing_camera({ colors: colors.sensing_camera });
    const everything = [
        xmlOpen,
        motorXML,
        gap,
        combined_motorXML,
        gap,
        matrixXML,
        gap,
        soundXML,
        gap,
        eventsXML,
        gap,
        controlXML,
        gap,
        sensingXML,
        gap,
        // sensing_cameraXML,
        // gap,
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
