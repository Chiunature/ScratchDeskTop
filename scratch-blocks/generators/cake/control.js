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
 * @fileoverview Generating cake for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.control');

goog.require('Blockly.cake');

const CONTINUE_STATEMENT = 'goto continue\n';

const addContinueLabel = function (branch) {
  if (branch.indexOf(CONTINUE_STATEMENT) !== -1) {
    // False positives are possible (e.g. a string literal), but are harmless.
    return branch + cake.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.cake['control_wait'] = function (block) {
  var arg0 = Blockly.cake.valueToCode(block, 'DURATION',
    Blockly.cake.ORDER_FUNCTION_CALL);
  var code = `waiteDelay(${Blockly.cake.toStr(arg0) ? arg0 : '"' + arg0 + '"'});\n`;
  return code;
};

Blockly.cake['control_repeat'] = function (block) {
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.cake.valueToCode(block, 'TIMES', Blockly.cake.ORDER_NONE) || '0';
    let flag = /^[0-9]+$/.test(repeats);
    if (!flag) {
      repeats = 'atoi(' + repeats + ')';
    }
  }
  var branch = Blockly.cake.statementToCode(block, 'SUBSTACK');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  branch = addContinueLabel(branch);
  var loopVar = Blockly.cake.variableDB_.getDistinctName(
    'count', Blockly.Variables.NAME_TYPE);
  var code = 'for (int ' + loopVar + ' = 0; ' +
    loopVar + ' < ' + repeats + '; ' +
    loopVar + '++) {\n' +
    branch + Blockly.cake.INDENT + 'vTaskDelay(1);\n}\n';
  return code;
};

Blockly.cake['control_forever'] = function (block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.cake.valueToCode(block, 'BOOL',
    until ? Blockly.cake.ORDER_LOGICAL_NOT :
      Blockly.cake.ORDER_NONE) || 'true';
  var branch = Blockly.cake.statementToCode(block, 'SUBSTACK');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + Blockly.cake.INDENT + 'vTaskDelay(1);\n}\n';
};

Blockly.cake['control_break'] = function (block) {
  return 'break;\n';
};

Blockly.cake['control_if_else'] = function (block) {
  var argument = Blockly.cake.valueToCode(block, 'CONDITION',
    Blockly.cake.ORDER_NONE) || 'False';
  var branch = Blockly.cake.statementToCode(block, 'SUBSTACK');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  var branch2 = Blockly.cake.statementToCode(block, 'SUBSTACK2');
  branch2 = Blockly.cake.addLoopTrap(branch2, block.id);

  var code = 'if (strcmp(' + `${Blockly.cake.toStr(argument) ? argument : '"' + argument + '"'}` + ', "TRUE") == 0) {\n';
  if (branch) {
    code += branch + "}";
  } else {
    code += Blockly.cake.INDENT + "}";
  }
  code += "else{\n";
  if (branch2) {
    code += branch2 + "}\n";
  } else {
    code += Blockly.cake.INDENT + "}\n";
  }
  return code;
};

Blockly.cake['control_wait_until'] = function (block) {
  var argument = Blockly.cake.valueToCode(block, 'CONDITION',
    Blockly.cake.ORDER_UNARY_POSTFIX) || 'False';

  var branch = Blockly.cake.statementToCode(block, 'SUBSTACK');
  branch = Blockly.cake.addLoopTrap(branch, block.id);

  /* var code = 'while (strcmp(' + `${Blockly.cake.toStr(argument) ? argument : '"' + argument + '"'}` + ', "TRUE") != 0){} {\n';
  code += branch;
  code += Blockly.cake.INDENT + "}\n"; */
  let code = 'while (strcmp(' + `${Blockly.cake.toStr(argument) ? argument : '"' + argument + '"'}` + ', "TRUE") != 0){vTaskDelay(1);}\n';
  return code;
};

Blockly.cake['control_repeat_until'] = function (block) {
  var argument = Blockly.cake.valueToCode(block, 'CONDITION',
    Blockly.cake.ORDER_UNARY_POSTFIX) || 'False';

  var branch = Blockly.cake.statementToCode(block, 'SUBSTACK');
  branch = Blockly.cake.addLoopTrap(branch, block.id);

  var code = 'while (strcmp(' + `${Blockly.cake.toStr(argument) ? argument : '"' + argument + '"'}` + ', "TRUE") != 0) {\n';
  code += branch;
  code += Blockly.cake.INDENT + "vTaskDelay(1);\n}\n";
  return code;
};

Blockly.cake['control_stop'] = function (block) {
  var argument = block.getFieldValue('STOP_OPTION',
    Blockly.cake.ORDER_NONE) || 'all';
  let res;
  switch (argument) {
    case 'single':
      res = 1;
      break;
    default:
      res = 2;
      break;
  }
  return `vTaskExit("${res}");\n`;
};


Blockly.cake['control_doWhile'] = function (block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.cake.valueToCode(block, 'BOOL',
    until ? Blockly.cake.ORDER_LOGICAL_NOT :
      Blockly.cake.ORDER_NONE) || 'false';
  var branch = Blockly.cake.statementToCode(block, 'DO');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'do {\n' + branch + Blockly.cake.INDENT + 'vTaskDelay(1);\n} while (strcmp(' + `${Blockly.cake.toStr(argument0) ? argument0 : '"' + argument0 + '"'}` + ', "TRUE") == 0);\n';
};

Blockly.cake['control_for'] = function (block) {
  // For loop.
  var variable0 = Blockly.cake.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  if (variable0 == '___EC_84_A0_ED_83_9D__' || variable0 == '--Select--') {
    variable0 = 'unselected';
  }
  var argument0 = Blockly.cake.valueToCode(block, 'FROM',
    Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.cake.valueToCode(block, 'TO',
    Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.cake.valueToCode(block, 'BY',
    Blockly.cake.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.cake.statementToCode(block, 'DO');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  var code;
  // All arguments are simple numbers.
  code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
    variable0 + '<' + argument1 + '; ' +
    variable0;
  var up = increment >= 0;
  var step = Math.abs(parseFloat(increment));
  if (step == 1) {
    code += up ? '++' : '--';
  } else {
    code += (up ? ' += ' : ' -= ') + step;
  }
  code += ') {\n' + branch + Blockly.cake.INDENT + 'vTaskDelay(1);\n}\n';

  return code;
};

Blockly.cake['control_flow_statements'] = function (block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};

Blockly.cake['control_if'] = function (block) {
  var argument = Blockly.cake.valueToCode(block, 'CONDITION',
    Blockly.cake.ORDER_NONE) || 'False';
  var branch = Blockly.cake.statementToCode(block, 'SUBSTACK');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  var code = 'if (strcmp(' + `${Blockly.cake.toStr(argument) ? argument : '"' + argument + '"'}` + ', "TRUE") == 0) {\n';
  if (branch) {
    code += branch;
  } else {
    code += Blockly.cake.INDENT + "\n";
  }
  return code + '}\n';
};
