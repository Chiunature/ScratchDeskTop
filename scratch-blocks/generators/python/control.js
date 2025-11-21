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
"use strict";

goog.provide("Blockly.Python.control");

goog.require("Blockly.Python");

Blockly.Python["control_wait"] = function (block) {
  let arg0 = Blockly.Python.valueToCode(
    block,
    "DURATION",
    Blockly.Python.ORDER_FUNCTION_CALL
  );
  const code = `sleep(${arg0})\n`;
  return Blockly.Python.handleResult(code, Blockly.Python.TIMER_TYPE, true);
};

Blockly.Python["control_repeat"] = function (block) {
  let repeats = Blockly.Python.valueToCode(
    block,
    "TIMES",
    Blockly.Python.ORDER_FUNCTION_CALL
  );
  let branch = Blockly.Python.statementToCode(block, "SUBSTACK");
  branch = Blockly.Python.addLoopTrap(branch, block.id);
  let code = "for _ in range(" + repeats + "):\n";
  return (
    code +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "await asyncio.sleep(0)\n" +
    Blockly.Python.addIndent(branch)
  );
};

Blockly.Python["control_forever"] = function (block) {
  let branch = Blockly.Python.statementToCode(block, "SUBSTACK");
  branch = Blockly.Python.addLoopTrap(branch, block.id);

  let code = "while True:\n";

  if (block.getRootBlock().type === "event_whenmicrobitbegin") {
    Blockly.Python.firstLoop = false;
    code += Blockly.Python.INDENT + "repeat()\n";
  }

  return (
    code +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "await asyncio.sleep(0)\n" +
    Blockly.Python.addIndent(branch)
  );
};

Blockly.Python["control_if"] = function (block) {
  let argument =
    Blockly.Python.valueToCode(block, "CONDITION", Blockly.Python.ORDER_NONE) ||
    "False";
  let branch = Blockly.Python.statementToCode(block, "SUBSTACK");
  branch = Blockly.Python.addLoopTrap(branch, block.id);

  let code = "if " + argument + ":\n";
  if (branch) {
    //有代码拼接
    code += Blockly.Python.addIndent(branch);
  } else {
    //没有代码拼接直接pass
    code += Blockly.Python.INDENT + Blockly.Python.INDENT + "pass\n";
  }
  return code;
};

Blockly.Python["control_if_else"] = function (block) {
  let argument =
    Blockly.Python.valueToCode(block, "CONDITION", Blockly.Python.ORDER_NONE) ||
    "False";
  let branch = Blockly.Python.statementToCode(block, "SUBSTACK");
  branch = Blockly.Python.addLoopTrap(branch, block.id);
  let branch2 = Blockly.Python.statementToCode(block, "SUBSTACK2");
  branch2 = Blockly.Python.addLoopTrap(branch2, block.id);

  let code = "if " + argument + ":\n";
  if (branch) {
    code += Blockly.Python.addIndent(branch);
  } else {
    code += Blockly.Python.INDENT + Blockly.Python.INDENT + "pass\n";
  }
  code += "else:\n";
  if (branch2) {
    code += Blockly.Python.addIndent(branch2);
  } else {
    code += Blockly.Python.INDENT + Blockly.Python.INDENT + "pass\n";
  }
  return code;
};

Blockly.Python["control_wait_until"] = function (block) {
  let argument =
    Blockly.Python.valueToCode(
      block,
      "CONDITION",
      Blockly.Python.ORDER_UNARY_POSTFIX
    ) || "False";

  let code = "while not (" + argument + "):\n";
  code +=
    Blockly.Python.INDENT + Blockly.Python.INDENT + "await asyncio.sleep(0)\n";

  if (block.getRootBlock().type === "event_whenmicrobitbegin") {
    code += Blockly.Python.INDENT + "repeat()\n";
  }

  return code;
};

Blockly.Python["control_repeat_until"] = function (block) {
  let argument =
    Blockly.Python.valueToCode(
      block,
      "CONDITION",
      Blockly.Python.ORDER_UNARY_POSTFIX
    ) || "False";

  let branch = Blockly.Python.statementToCode(block, "SUBSTACK");
  branch = Blockly.Python.addLoopTrap(branch, block.id);

  let code = "while not (" + argument + "):\n";

  if (block.getRootBlock().type === "event_whenmicrobitbegin") {
    code += Blockly.Python.INDENT + "repeat()\n";
  }
  return (
    code +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "await asyncio.sleep(0)\n" +
    Blockly.Python.addIndent(branch)
  );
};

Blockly.Python["control_break"] = function (block) {
  return "break\n";
};

Blockly.Python["control_stop"] = function (block) {
  const core = "return\n";
  return core;
};
