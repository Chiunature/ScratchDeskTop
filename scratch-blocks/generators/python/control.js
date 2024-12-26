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

goog.provide('Blockly.Python.control');

goog.require('Blockly.Python');


Blockly.Python['control_wait'] = function(block) {
  var arg0 = Blockly.Python.valueToCode(block, 'DURATION',
      Blockly.Python.ORDER_FUNCTION_CALL);
  var code = "\t_time.sleep_s(" + arg0 + ")\n";
  return code;
};

Blockly.Python['control_repeat'] = function(block) {
  var repeats = Blockly.Python.valueToCode(block, 'TIMES',
      Blockly.Python.ORDER_FUNCTION_CALL);
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
  branch = Blockly.Python.addLoopTrap(branch, block.id);

  var code = "\tfor count in range(" + repeats + "):\n";
  if (branch) {
    code += '\t' + branch;
  } else {
    code += Blockly.Python.INDENT + "\tpass\n";
  }
  return code;
};

Blockly.Python['control_forever'] = function(block) {
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
  branch = Blockly.Python.addLoopTrap(branch, block.id);

  var code = "\twhile True:\n";
  code += '\t' + branch;

  if (block.getRootBlock().type === 'event_whenmicrobitbegin') {
    Blockly.Python.firstLoop = false;
    code += Blockly.Python.INDENT + "\trepeat()\n";
  }

  return code;
};

Blockly.Python['control_if'] = function(block) {
  var argument = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
  branch = Blockly.Python.addLoopTrap(branch, block.id);

  var code = "\tif " + argument + ":\n";
  if (branch) {
    code += '\t' + branch;
  } else {
    code += Blockly.Python.INDENT + "\tpass\n";
  }
  return code;
};

Blockly.Python['control_if_else'] = function(block) {
  var argument = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
  branch = Blockly.Python.addLoopTrap(branch, block.id);
  var branch2 = Blockly.Python.statementToCode(block, 'SUBSTACK2');
  branch2 = Blockly.Python.addLoopTrap(branch2, block.id);

  var code = "\tif " + argument + ":\n";
  if (branch) {
    code += '\t' + branch;
  } else {
    code += Blockly.Python.INDENT + "\tpass\n";
  }
  code += "\telse:\n";
  if (branch2) {
    code += '\t' + branch2;
  } else {
    code += Blockly.Python.INDENT + "\tpass\n";
  }
  return code;
};

Blockly.Python['control_wait_until'] = function(block) {
  var argument = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_UNARY_POSTFIX) || 'False';
  var code = "\twhile not " + argument + ":\n";
  code += Blockly.Python.INDENT + "\tpass\n";
  if (block.getRootBlock().type === 'event_whenmicrobitbegin') {
    code += Blockly.Python.INDENT + "\trepeat()\n";
  }
  return code;
};

Blockly.Python['control_repeat_until'] = function(block) {
  var argument = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_UNARY_POSTFIX) || 'False';

  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
  branch = Blockly.Python.addLoopTrap(branch, block.id);

  var code = "\twhile not " + argument + ":\n";
  if (branch) {
    code += '\t' + branch;
  } else {
    code += Blockly.Python.INDENT + "\tpass\n";
  }
  
  if (block.getRootBlock().type === 'event_whenmicrobitbegin') {
    code += Blockly.Python.INDENT + "\trepeat()\n";
  }
  return code;
};

Blockly.Python['control_break'] = function (block) {
  return '\tbreak\n';
};