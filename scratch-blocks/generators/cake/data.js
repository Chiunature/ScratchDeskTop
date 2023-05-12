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

goog.provide('Blockly.cake.data');

goog.require('Blockly.cake');


Blockly.cake['data_variable'] = function (block) {
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE);
    return [varName, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['data_setvariableto'] = function (block) {
    var arg0 = Blockly.cake.valueToCode(block, 'VALUE',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE);
    if (varName === 'unnamed') {
        return '';
    }

    // Arg is a number
    if (parseFloat(arg0.slice(1, -1)) == arg0.slice(1, -1)) {
        arg0 = parseFloat(arg0.slice(1, -1)).toString();
    }
    return varName + ' = ' + arg0 + '\n';
};

Blockly.cake['data_changevariableby'] = function (block) {
    var arg0 = Blockly.cake.valueToCode(block, 'VALUE',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE);
    if (varName === 'unnamed') {
        return '';
    }

    return varName + ' += ' + arg0 + '\n';
};

Blockly.cake['data_showvariable'] = function () {
    return '';
};

Blockly.cake['data_hidevariable'] = function () {
    return '';
};

Blockly.cake['data_listcontents'] = function (block) {
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    return [varName, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['data_addtolist'] = function (block) {
    var item = Blockly.cake.valueToCode(block, 'ITEM',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    if (varName === 'unnamed') {
        return '';
    }

    return varName + '.append(' + item + ')\n';
};

Blockly.cake['data_deleteoflist'] = function (block) {
    var index = Blockly.cake.valueToCode(block, 'INDEX',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    if (varName === 'unnamed') {
        return '';
    }

    return 'del ' + varName + '[' + index + ' - 1]\n';
};

Blockly.cake['data_deletealloflist'] = function (block) {
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    if (varName === 'unnamed') {
        return '';
    }

    return 'del ' + varName + '[0:]\n';
};

Blockly.cake['data_insertatlist'] = function (block) {
    var item = Blockly.cake.valueToCode(block, 'ITEM',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var index = Blockly.cake.valueToCode(block, 'INDEX',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    if (varName === 'unnamed') {
        return '';
    }

    return varName + '.insert(' + index + ' - 1, ' + item + ')\n';
};

Blockly.cake['data_replaceitemoflist'] = function (block) {
    var item = Blockly.cake.valueToCode(block, 'ITEM',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var index = Blockly.cake.valueToCode(block, 'INDEX',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    if (varName === 'unnamed') {
        return '';
    }

    return varName + '[' + index + ' - 1] = ' + item + '\n';
};

Blockly.cake['data_itemoflist'] = function (block) {
    var index = Blockly.cake.valueToCode(block, 'INDEX',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    return [varName + '[' + index + ' - 1]', Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['data_itemnumoflist'] = function (block) {
    var item = Blockly.cake.valueToCode(block, 'ITEM',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    return [varName + '.index(' + item + ') + 1', Blockly.cake.ORDER_UNARY_SIGN];
};

Blockly.cake['data_lengthoflist'] = function (block) {
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    return ['len(' + varName + ')', Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['data_listcontainsitem'] = function (block) {
    var item = Blockly.cake.valueToCode(block, 'ITEM',
        Blockly.cake.ORDER_ADDITIVE) || '0';
    var varName = Blockly.cake.variableDB_.getName(block.getFieldValue('LIST'),
        Blockly.Variables.NAME_TYPE);
    return ['' + item + ' in ' + varName, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['data_showlist'] = function () {
    return '';
};

Blockly.cake['data_hidelist'] = function () {
    return '';
};

