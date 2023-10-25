import ScratchBlocks from "scratch-blocks";
import { defaultColors } from './themes';
const categorySeparator = '<sep gap="36"/>';

const blockSeparator = '<sep gap="36"/>'; // At default scale, about 28px


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


{/* 
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
*/}
const sound = function (isInitialSetup, isStage, targetId, soundName, colors) {
    return `
    <category name="%{BKY_CATEGORY_SOUND}" id="sound" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}">
        <block id="${targetId}_sound_playuntildone" type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
        </block>
        <block id="${targetId}_sound_play" type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
        </block>
        <block type="sound_stopallsounds"/>
        ${blockSeparator}
        <block type="sound_setvolumeto">
            <value name="VOLUME">
                <shadow type="math_0to100_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

{/* <block type="event_checkcolor">
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
        <block type="event_broadcastandwait">
                    <value name="BROADCAST_INPUT">
                      <shadow type="event_broadcast_menu"></shadow>
                    </value>
                </block>    
*/}
const events = function (isInitialSetup, isStage, targetId, colors) {
    return `
            <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="${colors.primary}"
            secondaryColour="${colors.tertiary}">
                ${blockSeparator}
                <block type="event_whenflagclicked"/>
                ${blockSeparator}
                <block type="event_whenbroadcastreceived">
                    <value name="BROADCAST_INPUT">
                        <shadow type="event_broadcast_menu"></shadow>
                    </value>
                </block>
                <block type="event_broadcast">
                    <value name="BROADCAST_INPUT">
                        <shadow type="event_broadcast_menu"></shadow>
                    </value>
                </block>
                ${categorySeparator}
            </category>
            `;
};

const control = function (isInitialSetup, isStage, targetId, colors) {
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
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block id="forever" type="control_forever"/>
        ${blockSeparator}
        <block type="control_if"/>
        <block type="control_if_else"/>
        <block id="wait_until" type="control_wait_until"/>
        <block id="repeat_until" type="control_repeat_until"/>
        ${blockSeparator}
        <block type="control_stop"/>
        ${blockSeparator}
        <block type="control_break"/>
        ${categorySeparator}
    </category>
    `;
};
{/*
    <block type="sensing_key_judgment"></block> 
    <block type="sensing_line_inspection_judgment"></block>
    <block type="sensing_magnetic_calibration"></block>
    <block type="sensing_magnetism"></block>
    <block type="sensing_compass"></block>
    <block type="sensing_timer"></block>
    <block type="sensing_reset_timer"></block>
    ${blockSeparator}
    <block id="loudness" type="sensing_loudness"/>
    ${blockSeparator}
    <block id="current" type="sensing_current"/>
    <block type="sensing_dayssince2000"/>
*/}
const sensing = function (isInitialSetup, isStage, targetId, colors) {
    const name = ScratchBlocks.ScratchMsgs.translate(
        "SENSING_ASK_TEXT",
        "What's your name?"
    );
    return `
    <category name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="${colors.primary}"
    secondaryColour="${colors.tertiary}">
        ${isStage
            ? ""
            : `
            <block type="sensing_color_judgment"></block>
            <block type="sensing_color_detection"></block>
            <block type="sensing_color_detectionRGB"></block>
            <block type="sensing_reflected_light_judgment"></block>
            <block type="sensing_reflected_light_detection"></block>
            <block type="sensing_ultrasonic_judgment"></block>
            <block type="sensing_ultrasonic_detection"></block>
            <block type="sensing_sound_intensity"></block>
            <block type="sensing_key_press"></block>
            <block type="sensing_gyroscope_acceleration"></block>
            <block type="sensing_gyroscope_attitude"></block>
            ${blockSeparator}
        `
        }
        ${categorySeparator}
    </category>
    `;
};

const operators = function (isInitialSetup, colors) {
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
        ${blockSeparator}
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
        ${blockSeparator}
        <block type="operator_and"/>
        <block type="operator_or"/>
        <block type="operator_not"/>
        ${blockSeparator}
        ${isInitialSetup
            ? ""
            : `
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
            <block type="operator_length">
                <value name="STRING">
                    <shadow type="text">
                        <field name="TEXT">${apple}</field>
                    </shadow>
                </value>
            </block>
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
        `
        }
        ${blockSeparator}
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
        ${categorySeparator}
    </category>
    `;
};

const variables = function (colors) {
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

const myBlocks = function (colors) {
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

/* 
    <block type="motor_specifiedangle">
            <value name="ANGLE">
                <shadow type="math_angle"></shadow>
            </value>
        </block>
        <block type="motor_relative_position"></block>
*/

const motor = function (isInitialSetup, isStage, targetId, colors) {
    const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        "MOTOR_STAGE_SELECTED",
        "Stage selected: no motor blocks"
    );
    return `
    <category
        name="%{BKY_CATEGORY_MOTOR}"
        id="motor"
        colour="${colors.primary}"
        secondaryColour="${colors.tertiary}">
        ${isStage
            ? `
        <label text="${stageSelected}"></label>
        `
            : `
        <block type="motor_starting"></block>
        <block type="motor_stop"></block>
        <block type="motor_speed">
            <value name="SPEED">
                <shadow type="math_0to100_number"></shadow>
            </value>
        </block>
        <block type="motor_specifiedunit"></block>
        <block type="motor_specified_manner"></block>
        <block type="motor_rate"></block>
        `
        }
    </category>
    `;
};
{/* <block type="combined_motor_move">
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
    */}

const combined_motor = function (isInitialSetup, isStage, targetId, colors) {
    const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        "MOTOR_STAGE_SELECTED",
        "Stage selected: no combined_motor blocks"
    );
    return `
    <category
        name="%{BKY_CATEGORY_COMBINED_MOTOR}"
        id="combined_motor"
        colour="${colors.primary}"
        secondaryColour="${colors.tertiary}">
        ${isStage
            ? `
        <label text="${stageSelected}"></label>
        `
            : `
        <block type="combined_motor_starting">
            <value name="PORT1">
                <shadow type="combined_motorOne_menu"></shadow>
            </value>
            <value name="PORT2">
                <shadow type="combined_motorTwo_menu"></shadow>
            </value>
        </block>
        <block type="combined_motor_direction"></block>
        <block type="combined_motor_speed">
            <value name="SPEED">
                <shadow type="math_-100to100_number"></shadow>
            </value>
        </block>
        <block type="combined_motor_line">
            <value name="PORT1">
                <shadow type="combined_motorOne_menu"></shadow>
            </value>
            <value name="PORT2">
                <shadow type="combined_motorTwo_menu"></shadow>
            </value>
        </block>
        <block type="combined_motor_stop"></block>
        <block type="combined_motor_movestep">
            <value name="left">
                <shadow type="math_-100to100_number"></shadow>
            </value>
            <value name="right">
                <shadow type="math_-100to100_number"></shadow>
            </value>
        </block>
        <block type="combined_motor_angle">
            <value name="ANGLE">
                <shadow type="math_angle"></shadow>
            </value>
        </block>
        <block type="combined_motor_stopping"></block>
        `
        }
    </category>
    `;
};
{/* <block type="matrix_lamp_single">
            <value name="brightness">
                <shadow type="math_0to100_number"></shadow>
            </value>
        </block> */}
const matrix = function (isInitialSetup, isStage, targetId, colors) {
    const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        "MOTOR_STAGE_SELECTED",
        "Stage selected: no matrix blocks"
    );
    return `
    <category
        name="%{BKY_CATEGORY_MATRIX}"
        id="matrix"
        colour="${colors.primary}"
        secondaryColour="${colors.tertiary}">
        ${isStage
            ? `
        <label text="${stageSelected}"></label>
        `
            : `
        <block type="matrix_lamp">
            <value name="COLOR">
                <shadow type="colour_picker"/>
            </value>
        </block>
        <block type="matrix_lamp_stop"></block>
        <block type="matrix_lamp_set">
            <value name="brightness">
                <shadow type="math_0to100_number"></shadow>
            </value>
        </block>
        <block type="matrix_lamp_text"></block>
        <block type="matrix_lamp_useRGB"></block>
        `
        }
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
    const soundXML =
        moveCategory("sound") ||
        sound(isInitialSetup, isStage, targetId, soundName, colors.sounds);
    const eventsXML =
        moveCategory("event") || events(isInitialSetup, isStage, targetId, colors.event);
    const controlXML =
        moveCategory("control") || control(isInitialSetup, isStage, targetId, colors.control);
    const sensingXML =
        moveCategory("sensing") || sensing(isInitialSetup, isStage, targetId, colors.sensing);
    const operatorsXML =
        moveCategory("operators") ||
        operators(isInitialSetup, colors.operators);
    const variablesXML =
        moveCategory("data") || variables(colors.data);
    const myBlocksXML =
        moveCategory("procedures") ||
        myBlocks(colors.more);
    const motorXML =
        moveCategory("motor") || motor(isInitialSetup, isStage, targetId, colors.motor);
    const combined_motorXML =
        moveCategory("combined_motor") ||
        combined_motor(isInitialSetup, isStage, targetId, colors.combined_motor);
    const matrixXML =
        moveCategory("matrix") || matrix(isInitialSetup, isStage, targetId, colors.matrix);
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
