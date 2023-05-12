/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
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

/**
 * @fileoverview Generating cake for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.procedures');

goog.require('Blockly.cake');

Blockly.cake['main_block'] = function (block) {
    // Define a procedure with a return value.
    var funcName = 'main';
    var branch = Blockly.cake.statementToCode(block, 'STACK');
    if (Blockly.cake.STATEMENT_PREFIX) {
        branch = Blockly.cake.prefixLines(
            Blockly.cake.STATEMENT_PREFIX.replace(/%1/g,
                '\'' + block.id + '\''), Blockly.cake.INDENT) + branch;
    }
    if (Blockly.cake.INFINITE_LOOP_TRAP) {
        branch = Blockly.cake.INFINITE_LOOP_TRAP.replace(/%1/g,
            '\'' + block.id + '\'') + branch;
    }
    var returnValue = Blockly.cake.valueToCode(block, 'RETURN',
        Blockly.cake.ORDER_NONE) || '';
    if (returnValue) {
        returnValue = '  return ' + returnValue + ';\n';
    }
    else {
        returnValue = '  return 0;\n';
    }
    var args = [];
    var argTypes = [];
    var typePlusArgs = [];
    for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.cake.variableDB_.getName(block.arguments_[x],
            Blockly.Variables.NAME_TYPE);
        argTypes[x] = block.types_[x];
        typePlusArgs[x] = argTypes[x] + ' ' + args[x];
    }
    var returnType = 'int';

    var rand = [];
    var time = [];
    for (var name in Blockly.cake.times_) {
        var def = Blockly.cake.times_[name];
        var nameSrand = 'srand';
        var nameTime = 'time';
        var preDef;
        if (name.match(nameSrand)) {
            if (def[0] == 'main_block') {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                rand.push(preDef);
            }
        }
        else if (name.match(nameTime)) {
            if (def[0] == 'main_block') {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                time.push(preDef);
            }
        }
    }
    if (rand.length) {
        var allDefs = rand.join('\n') + '\n' + time.join('\n');
    }
    else {
        var allDefs = time.join('\n');
    }

    var code = returnType + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {' +
        allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    code = Blockly.cake.scrub_(block, code);
    Blockly.cake.definitions_[funcName] = code;
    return null;
};

Blockly.cake['procedures_return'] = function (block) {
    var returnValue = block.getFieldValue('VALUE');
    if (returnValue) {
        return 'return ' + returnValue + ';\n';
    }
    else {
        return 'return 0;\n';
    }
};

Blockly.cake['procedures_defreturn'] = function (block) {
    // Define a procedure with a return value.
    var funcName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var branch = Blockly.cake.statementToCode(block, 'STACK');
    if (Blockly.cake.STATEMENT_PREFIX) {
        branch = Blockly.cake.prefixLines(
            Blockly.cake.STATEMENT_PREFIX.replace(/%1/g,
                '\'' + block.id + '\''), Blockly.cake.INDENT) + branch;
    }
    if (Blockly.cake.INFINITE_LOOP_TRAP) {
        branch = Blockly.cake.INFINITE_LOOP_TRAP.replace(/%1/g,
            '\'' + block.id + '\'') + branch;
    }
    var returnValue = Blockly.cake.valueToCode(block, 'RETURN',
        Blockly.cake.ORDER_NONE) || '';
    if (returnValue) {
        returnValue = '  return ' + returnValue + ';\n';
    }
    else {
        returnValue = '  return 0;\n';
    }
    var typePlusArgs = Blockly.Procedures.getTypePlusArgs(block);

    var rand = [];
    var time = [];
    for (var name in Blockly.cake.times_) {
        var def = Blockly.cake.times_[name];
        var nameSrand = 'srand';
        var nameTime = 'time';
        var preDef;
        if (name.match(nameSrand)) {
            if (def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                rand.push(preDef);
            }
        }
        else if (name.match(nameTime)) {
            if (def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                time.push(preDef);
            }
        }
    }
    if (rand.length) {
        var allDefs = rand.join('\n') + '\n' + time.join('\n');
    }
    else {
        var allDefs = time.join('\n');
    }

    var returnType = block.getFieldValue('TYPES');
    var returnDist = block.getFieldValue('DISTS');
    var returnSpec, code;
    if (returnDist == 'pointer') {
        returnSpec = block.getFieldValue('PSPECS');
        if (returnSpec == null) {
            returnSpec = '*';
        }
        code = returnType + returnSpec + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
            allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    }
    else if (returnDist == 'array') {
        returnSpec = block.getFieldValue('ASPECS');
        if (returnSpec == null) {
            returnSpec = '[]';
        }
        code = returnType + returnSpec + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
            allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    }
    else {
        code = returnType + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
            allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    }
    code = Blockly.cake.scrub_(block, code);
    Blockly.cake.definitions_[funcName] = code;
    Blockly.cake.definitions_['Func_declare' + funcName] =
        returnType + ' ' + funcName + '(' + typePlusArgs.join(', ') + ');';
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.PROCEDURES_ILLEGALNAME, funcName) == -1) {
        this.initName();
    }
    return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.cake['procedures_defnoreturn'] = function (block) {
    // Define a procedure with a return value.
    var funcName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var branch = Blockly.cake.statementToCode(block, 'STACK');

    var rand = [];
    var time = [];
    for (var name in Blockly.cake.times_) {
        var def = Blockly.cake.times_[name];
        var nameSrand = 'srand';
        var nameTime = 'time';
        var preDef;
        if (name.match(nameSrand)) {
            if (def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                rand.push(preDef);
            }
        }
        else if (name.match(nameTime)) {
            if (def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                time.push(preDef);
            }
        }
    }
    if (rand.length) {
        var allDefs = rand.join('\n') + '\n' + time.join('\n');
    }
    else {
        var allDefs = time.join('\n');
    }

    if (Blockly.cake.STATEMENT_PREFIX) {
        branch = Blockly.cake.prefixLines(
            Blockly.cake.STATEMENT_PREFIX.replace(/%1/g,
                '\'' + block.id + '\''), Blockly.cake.INDENT) + branch;
    }
    if (Blockly.cake.INFINITE_LOOP_TRAP) {
        branch = Blockly.cake.INFINITE_LOOP_TRAP.replace(/%1/g,
            '\'' + block.id + '\'') + branch;
    }
    var returnValue = Blockly.cake.valueToCode(block, 'RETURN',
        Blockly.cake.ORDER_NONE) || '';
    if (returnValue) {
        returnValue = '  return ' + returnValue + ';\n';
    }
    var typePlusArgs = Blockly.Procedures.getTypePlusArgs(block);

    var code = 'void ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
        allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    code = Blockly.cake.scrub_(block, code);
    Blockly.cake.definitions_[funcName] = code;
    Blockly.cake.definitions_['Func_declare' + funcName] =
        'void ' + funcName + '(' + typePlusArgs.join(', ') + ');';
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.PROCEDURES_ILLEGALNAME, funcName) == -1) {
        this.initName();
    }
    return null;
};

Blockly.cake['procedures_callreturn'] = function (block) {
    // Call a procedure with a return value.
    var funcName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.cake.valueToCode(block, 'ARG' + x,
            Blockly.cake.ORDER_COMMA) || 'null';
    }
    var code = funcName + '(' + args.join(', ') + ')';
    return [code, Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['procedures_callnoreturn'] = function (block) {
    // Call a procedure with no return value.
    var funcName = Blockly.cake.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.cake.valueToCode(block, 'ARG' + x,
            Blockly.cake.ORDER_COMMA) || 'null';
    }
    var code = funcName + '(' + args.join(', ') + ');\n';
    return code;
};

Blockly.cake['procedures_call'] = function (block) {
    // Generators can not automatic handle indefinite parameters. We should get
    // block.inputList and handle
    var funcName = block.getProcCode();
    funcName = funcName.replace(/ /g, '_');
    funcName = funcName.replace(/%n/g, 'N');
    funcName = funcName.replace(/%s/g, 'S');
    funcName = funcName.replace(/%b/g, 'B');
    funcName = Blockly.cake.variableDB_.getName(funcName, Blockly.Procedures.NAME_TYPE);

    var argCode = [];
    for (var x = 0; x < block.inputList.length; x++) {
        if (block.inputList[x].type == Blockly.INPUT_VALUE) {
            if (block.inputList[x].connection.targetBlock()) {
                var targetBlock = block.inputList[x].connection.targetBlock();
                var targetCode = Blockly.cake.blockToCode(targetBlock);
                argCode.push(targetCode[0]);
            }
            // If empty mean's it's a boolean
            else {
                argCode.push('false');
            }
        }
    }
}

Blockly.cake['procedures_definition'] = function (block) {
    var func = Blockly.cake.statementToCode(block, 'custom_block');

    // Delet first indent.
    func = func.slice(2);
    var code = func + '() {\n';

    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (!nextBlock) {
        code += Blockly.cake.INDENT + ";\n";
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

    Blockly.cake.customFunctions_[func] = code;
    return null;
};

Blockly.cake['procedures_prototype'] = function (block) {
    var funcName = block.getProcCode();
    var argName = block.displayNames_;
    var argCode = [];

    funcName = funcName.replace(/ /g, '_');
    for (var i = 0; i < argName.length; i++) {
        var ch = funcName.charAt(funcName.indexOf('%') + 1);
        var safeArgName = Blockly.cake.variableDB_.getName(argName[i], Blockly.Procedures.NAME_TYPE);
        Blockly.cake.customFunctionsArgName_[argName[i]] = safeArgName;

        if (ch === 'n') {
            funcName = funcName.replace('%n', 'N');
            argCode.push(safeArgName);
        }
        else if (ch === 's') {
            funcName = funcName.replace('%s', 'S');
            argCode.push(safeArgName);
        }
        else {
            funcName = funcName.replace('%b', 'B');
            argCode.push(safeArgName);
        }
    }
    funcName = Blockly.cake.variableDB_.getName(funcName, Blockly.Procedures.NAME_TYPE);

    var code = 'void ' + funcName + '(' + argCode.join(', ') + ')';
    return code;
};

Blockly.cake['argument_reporter_boolean'] = function (block) {
    var argName = block.getFieldValue('VALUE');
    var safeArgName = Blockly.cake.customFunctionsArgName_[argName];
    return [safeArgName, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['argument_reporter_number'] = function (block) {
    var argName = block.getFieldValue('VALUE');
    var safeArgName = Blockly.cake.customFunctionsArgName_[argName];
    return [safeArgName, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['argument_reporter_string'] = function (block) {
    var argName = block.getFieldValue('VALUE');
    var safeArgName = Blockly.cake.customFunctionsArgName_[argName];
    return [safeArgName, Blockly.cake.ORDER_ATOMIC];
};
