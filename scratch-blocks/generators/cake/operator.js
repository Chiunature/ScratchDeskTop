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

goog.provide('Blockly.cake.operator');

goog.require('Blockly.cake');


Blockly.cake['operator_arithmetic'] = function (block) {
    var oplist = {
        operator_add: [' + ', Blockly.cake.ORDER_ADDITIVE],
        operator_subtract: [' - ', Blockly.cake.ORDER_ADDITIVE],
        operator_multiply: [' * ', Blockly.cake.ORDER_MULTIPLICATIVE],
        operator_divide: [' / ', Blockly.cake.ORDER_MULTIPLICATIVE]
    };
    var tuple = oplist[block.type];
    var op = tuple[0];
    var order = tuple[1];
    // Numeric value.
    var argument0 = Blockly.cake.valueToCode(block, 'NUM1', order) || '0';
    var argument1 = Blockly.cake.valueToCode(block, 'NUM2', order) || '0';
    var code = argument0 + op + argument1;
    return [code, order];
};

Blockly.cake['operator_add'] = Blockly.cake['operator_arithmetic'];
Blockly.cake['operator_subtract'] = Blockly.cake['operator_arithmetic'];
Blockly.cake['operator_multiply'] = Blockly.cake['operator_arithmetic'];
Blockly.cake['operator_divide'] = Blockly.cake['operator_arithmetic'];

Blockly.cake['operator_random'] = function (block) {
    var arg0 = Blockly.cake.valueToCode(block, 'FROM', Blockly.cake.ORDER_FUNCTION_CALL) || '0';
    var arg1 = Blockly.cake.valueToCode(block, 'TO', Blockly.cake.ORDER_FUNCTION_CALL) || '0';
    var code = "random.randint(" + arg0 + ", " + arg1 + ")";
    return [code, Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['operator_compare'] = function (block) {
    var oplist = {
        "operator_gt": " > ",
        "operator_equals": " == ",
        "operator_lt": " < "
    };
    var order = Blockly.cake.ORDER_RELATIONAL;
    var arg0 = Blockly.cake.valueToCode(block, 'OPERAND1', order);
    var arg1 = Blockly.cake.valueToCode(block, 'OPERAND2', order);

    if (parseFloat(arg0.slice(1, -1)) == arg0.slice(1, -1)) { // Arg is a number
        arg0 = parseFloat(arg0.slice(1, -1)).toString();
    } else if (arg0 === "''") { // Arg is a empty string
        arg0 = '0';
    }
    if (parseFloat(arg1.slice(1, -1)) == arg1.slice(1, -1)) {
        arg1 = parseFloat(arg1.slice(1, -1)).toString();
    } else if (arg1 === "''") {
        arg1 = '0';
    }

    var op = oplist[block.type];
    var code = arg0 + op + arg1;
    return [code, order];
};

Blockly.cake['operator_gt'] = Blockly.cake['operator_compare'];
Blockly.cake['operator_equals'] = Blockly.cake['operator_compare'];
Blockly.cake['operator_lt'] = Blockly.cake['operator_compare'];

Blockly.cake['operator_operation'] = function (block) {
    var oplist = {
        "operator_and": " and ",
        "operator_or": " or "
    };
    var order = (block.type == "operator_and") ? Blockly.cake.ORDER_LOGICAL_AND :
        Blockly.cake.ORDER_LOGICAL_OR;
    var arg0 = Blockly.cake.valueToCode(block, 'OPERAND1', order) || '0';
    var arg1 = Blockly.cake.valueToCode(block, 'OPERAND2', order) || '0';
    var op = oplist[block.type];
    var code = arg0 + op + arg1;
    return [code, order];
};

Blockly.cake['operator_and'] = Blockly.cake['operator_operation'];
Blockly.cake['operator_or'] = Blockly.cake['operator_operation'];

Blockly.cake['operator_not'] = function (block) {
    // Negation.
    var order = Blockly.cake.ORDER_LOGICAL_NOT;
    var arg0 = Blockly.cake.valueToCode(block, 'OPERAND', order) || 'false';
    var code = '!' + arg0;
    return [code, order];
};

Blockly.cake['operator_join'] = function (block) {
    var order = Blockly.cake.ORDER_UNARY_PREFIX;
    var arg0 = Blockly.cake.valueToCode(block, 'STRING1', order) || '\'\'';
    var arg1 = Blockly.cake.valueToCode(block, 'STRING2', order) || '\'\'';
    // var code = 'str(' + arg0 + ') + str(' + arg1 + ')';
    let code = `Str_Connect("${arg0}", "${arg1}")`;
    return [code, Blockly.cake.ORDER_ADDITIVE];
};

Blockly.cake['operator_letter_of'] = function (block) {
    var arg0 = Blockly.cake.valueToCode(block, 'STRING', Blockly.cake.ORDER_UNARY_SIGN) || '\'\'';
    var arg1 = Blockly.cake.valueToCode(block, 'LETTER', Blockly.cake.ORDER_MEMBER) || '0';

    // Arg is a number
    if (parseFloat(arg1) == arg1) {
        arg1 = arg1 - 1;
    } else {
        arg1 = arg1 + ' - 1';
    }

    var code = arg0 + '[' + arg1 + ']';
    return [code, Blockly.cake.ORDER_MEMBER];
};

Blockly.cake['operator_length'] = function (block) {
    var arg0 = Blockly.cake.valueToCode(block, 'STRING', Blockly.cake.ORDER_FUNCTION_CALL) || '\'\'';
    var code = 'Str_Strlen("' + arg0 + '")';
    return [code, Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['operator_contains'] = function (block) {
    var order = Blockly.cake.ORDER_FUNCTION_CALL;
    var arg0 = Blockly.cake.valueToCode(block, 'STRING1', order) || '\'\'';
    var arg1 = Blockly.cake.valueToCode(block, 'STRING2', order) || '0';
    var code = `Str_Matchine("${arg0}", '${arg1}')`;
    return [code, Blockly.cake.ORDER_RELATIONAL];
};

Blockly.cake['operator_mod'] = function (block) {
    var order = Blockly.cake.ORDER_MULTIPLICATIVE;
    var arg0 = Blockly.cake.valueToCode(block, 'NUM1', order) || '0';
    var arg1 = Blockly.cake.valueToCode(block, 'NUM2', order) || '0';
    var code = arg0 + ' % ' + arg1;
    return [code, order];
};

Blockly.cake['operator_round'] = function (block) {
    var order = Blockly.cake.ORDER_UNARY_POSTFIX;
    var arg0 = Blockly.cake.valueToCode(block, 'NUM', order) || '0';
    var code = 'Rounding(' + arg0 + ')';
    return [code, Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['operator_mathop'] = function (block) {
    var mode = block.getFieldValue('OPERATOR');
    var arg0 = Blockly.cake.valueToCode(block, 'NUM', Blockly.cake.ORDER_FUNCTION_CALL) || '0';

    // Blockly.cake.imports_["math"] = "import math";

    var code = `Calculation("${mode}", ${arg0})`;
    var order = Blockly.cake.ORDER_FUNCTION_CALL;

    /* switch (mode) {
        case 'abs':
            code = 'math.fabs(' + arg0 + ')';
            break;
        case 'floor':
            code = 'math.floor(' + arg0 + ')';
            break;
        case 'ceiling':
            code = 'math.ceil(' + arg0 + ')';
            break;
        case 'sqrt':
            code = 'math.sqrt(' + arg0 + ')';
            break;
        case 'sin':
            code = 'math.sin(' + arg0 + ' / 180.0 * math.pi)';
            break;
        case 'cos':
            code = 'math.cos(' + arg0 + ' / 180.0 * math.pi)';
            break;
        case 'tan':
            code = 'math.tan(' + arg0 + ' / 180.0 * math.pi)';
            break;
        case 'asin':
            code = 'math.asin(' + arg0 + ') / math.pi * 180';
            order = Blockly.cake.ORDER_MULTIPLICATIVE;
            break;
        case 'acos':
            code = 'math.acosh(' + arg0 + ') / math.pi * 180';
            order = Blockly.cake.ORDER_MULTIPLICATIVE;
            break;
        case 'atan':
            code = 'math.atan(' + arg0 + ') / math.pi * 180';
            order = Blockly.cake.ORDER_MULTIPLICATIVE;
            break;
        case 'ln':
            code = 'math.log(' + arg0 + ')';
            break;
        case 'log':
            code = 'math.log(' + arg0 + ', 10)';
            break;
        case 'e ^':
            code = 'math.exp(' + arg0 + ')';
            break;
        case '10 ^':
            code = 'math.pow(10, ' + arg0 + ')';
            break;
    } */
    return [code, order];
};
