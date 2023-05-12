/**
 * Visual Blocks Language
 *
 * Copyright 2021 openblock.cc.
 * https://github.com/openblockcc/openblock-blocks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

goog.provide('Blockly.cake.event');

goog.require('Blockly.cake');

Blockly.cake['event_whenflagclicked'] = function (block) {
    return '';
};

Blockly.cake['event_whenmicrobitbegin'] = function (block) {
    Blockly.cake.imports_["microbit"] = "from microbit import *";

    var code = "";
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (!nextBlock) {
        code += ";\n";
    }

    return code;
};

Blockly.cake['event_whenmicrobitbuttonpressed'] = function (block) {
    Blockly.cake.imports_["microbit"] = "from microbit import *";

    var key = block.getFieldValue('KEY_OPTION');

    var i = '';
    while (Blockly.cake.loops_["event_whenmicrobitbegin" + key + i]) {
        if (i === '') {
            i = 1;
        } else {
            i++;
        }
    }

    Blockly.cake.loops_["event_whenmicrobitbegin" + key + i] = "if button_" + key + ".is_pressed() {\n" +
        Blockly.cake.INDENT + Blockly.cake.INDENT + "on_button_" + key + i + "()";

    var code = "void on_button_" + key + i + "() {\n";

    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (!nextBlock) {
        code += Blockly.cake.INDENT + ";\n}\n";
    } else {
        var variablesName = [];
        for (var x in Blockly.cake.variables_) {
            variablesName.push(Blockly.cake.variables_[x].slice(0, Blockly.cake.variables_[x].indexOf('=') - 1));
        }
        if (variablesName.length !== 0) {
            code += Blockly.cake.INDENT + "global " + variablesName.join(', ') + "\n";
        }

        code = Blockly.cake.scrub_(block, code);
    }

    Blockly.cake.libraries_["void on_button_" + key + i] = code;
    return null;
};

Blockly.cake['event_whenmicrobitpinbeingtouched'] = function (block) {
    Blockly.cake.imports_["microbit"] = "from microbit import *";

    var pin = block.getFieldValue('PIN_OPTION');

    var i = '';
    while (Blockly.cake.loops_["event_whenmicrobitpinbeingtouched" + pin + i]) {
        if (i === '') {
            i = 1;
        } else {
            i++;
        }
    }

    Blockly.cake.loops_["event_whenmicrobitpinbeingtouched" + pin + i] = "if pin" + pin + ".is_pressed() {\n" +
        Blockly.cake.INDENT + Blockly.cake.INDENT + "on_pin" + pin + i + "()";

    var code = "void on_pin" + pin + i + "() {\n";
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (!nextBlock) {
        code += Blockly.cake.INDENT + ";\n}\n";
    } else {
        var variablesName = [];
        for (var x in Blockly.cake.variables_) {
            variablesName.push(Blockly.cake.variables_[x].slice(0, Blockly.cake.variables_[x].indexOf('=') - 1));
        }
        if (variablesName.length !== 0) {
            code += Blockly.cake.INDENT + "global " + variablesName.join(', ') + "\n}";
        }

        code = Blockly.cake.scrub_(block, code);
    }

    Blockly.cake.libraries_["void on_pin" + pin + i] = code;
    return null;
};

Blockly.cake['event_whenmicrobitgesture'] = function (block) {
    Blockly.cake.imports_["microbit"] = "from microbit import *";

    var sta = block.getFieldValue('GESTURE_OPTION');

    var i = '';
    while (Blockly.cake.loops_["event_whenmicrobitgesture" + sta + i]) {
        if (i === '') {
            i = 1;
        } else {
            i++;
        }
    }

    Blockly.cake.loops_["event_whenmicrobitgesture" + sta + i] = "if accelerometer.was_gesture('" + sta + "') {\n" +
        Blockly.cake.INDENT + Blockly.cake.INDENT + "on_" + sta + i + "()";

    var code = "void on_" + sta + i + "() {\n";
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (!nextBlock) {
        code += Blockly.cake.INDENT + ";\n}\n";
    } else {
        var variablesName = [];
        for (var x in Blockly.cake.variables_) {
            variablesName.push(Blockly.cake.variables_[x].slice(0, Blockly.cake.variables_[x].indexOf('=') - 1));
        }
        if (variablesName.length !== 0) {
            code += Blockly.cake.INDENT + "global " + variablesName.join(', ') + "\n}";
        }

        code = Blockly.cake.scrub_(block, code);
    }

    Blockly.cake.libraries_["void on_" + sta + i] = code;
    return null;
};

Blockly.cake['event_checkcolor'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let color = block.getFieldValue('COLOR');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['event_keyjudement'] = function (block) {
    let dropdown_port = block.getFieldValue('PORT');
    let status = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['event_tilts'] = function (block) {
    let dropdown_direction = block.getFieldValue('direction');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};

Blockly.cake['event_keypress'] = function (block) {
    let dropdown_direction = block.getFieldValue('direction');
    let status = block.getFieldValue('status');
    // TODO: Assemble cake into code variable.
    let code = '...\n';
    return code;
};