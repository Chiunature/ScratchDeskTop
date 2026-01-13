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

goog.provide("Blockly.Python.event");

goog.require("Blockly.Python");

Blockly.Python["event_whenmicrobitbegin"] = function (block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var code = "";
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (!nextBlock) {
    code += "pass\n";
  }

  return code;
};

Blockly.Python["event_whenmicrobitbuttonpressed"] = function (block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var key = block.getFieldValue("KEY_OPTION");

  var i = "";
  while (Blockly.Python.loops_["event_whenmicrobitbegin" + key + i]) {
    if (i === "") {
      i = 1;
    } else {
      i++;
    }
  }

  Blockly.Python.loops_["event_whenmicrobitbegin" + key + i] =
    "if button_" +
    key +
    ".is_pressed():\n" +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "on_button_" +
    key +
    i +
    "()";

  var code = "def on_button_" + key + i + "():\n";

  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (!nextBlock) {
    code += Blockly.Python.INDENT + "pass\n";
  } else {
    var variablesName = [];
    for (var x in Blockly.Python.variables_) {
      variablesName.push(
        Blockly.Python.variables_[x].slice(
          0,
          Blockly.Python.variables_[x].indexOf("=") - 1
        )
      );
    }
    if (variablesName.length !== 0) {
      code +=
        Blockly.Python.INDENT + "global " + variablesName.join(", ") + "\n";
    }

    code = Blockly.Python.scrub_(block, code);
  }

  Blockly.Python.libraries_["def on_button_" + key + i] = code;
  return null;
};

Blockly.Python["event_whenmicrobitpinbeingtouched"] = function (block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var pin = block.getFieldValue("PIN_OPTION");

  var i = "";
  while (Blockly.Python.loops_["event_whenmicrobitpinbeingtouched" + pin + i]) {
    if (i === "") {
      i = 1;
    } else {
      i++;
    }
  }

  Blockly.Python.loops_["event_whenmicrobitpinbeingtouched" + pin + i] =
    "if pin" +
    pin +
    ".is_pressed():\n" +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "on_pin" +
    pin +
    i +
    "()";

  var code = "def on_pin" + pin + i + "():\n";
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (!nextBlock) {
    code += Blockly.Python.INDENT + "pass\n";
  } else {
    var variablesName = [];
    for (var x in Blockly.Python.variables_) {
      variablesName.push(
        Blockly.Python.variables_[x].slice(
          0,
          Blockly.Python.variables_[x].indexOf("=") - 1
        )
      );
    }
    if (variablesName.length !== 0) {
      code +=
        Blockly.Python.INDENT + "global " + variablesName.join(", ") + "\n";
    }

    code = Blockly.Python.scrub_(block, code);
  }

  Blockly.Python.libraries_["def on_pin" + pin + i] = code;
  return null;
};

Blockly.Python["event_whenmicrobitgesture"] = function (block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var sta = block.getFieldValue("GESTURE_OPTION");

  var i = "";
  while (Blockly.Python.loops_["event_whenmicrobitgesture" + sta + i]) {
    if (i === "") {
      i = 1;
    } else {
      i++;
    }
  }

  Blockly.Python.loops_["event_whenmicrobitgesture" + sta + i] =
    "if accelerometer.was_gesture('" +
    sta +
    "'):\n" +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "on_" +
    sta +
    i +
    "()";

  var code = "def on_" + sta + i + "():\n";
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (!nextBlock) {
    code += Blockly.Python.INDENT + "pass\n";
  } else {
    var variablesName = [];
    for (var x in Blockly.Python.variables_) {
      variablesName.push(
        Blockly.Python.variables_[x].slice(
          0,
          Blockly.Python.variables_[x].indexOf("=") - 1
        )
      );
    }
    if (variablesName.length !== 0) {
      code +=
        Blockly.Python.INDENT + "global " + variablesName.join(", ") + "\n";
    }

    code = Blockly.Python.scrub_(block, code);
  }

  Blockly.Python.libraries_["def on_" + sta + i] = code;
  return null;
};

Blockly.Python["event_whenflagclicked"] = function (block) {
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();

  var code = "";
  if (!nextBlock) {
    code += Blockly.Python.INDENT + "\n";
  } else {
    // 只需要添加 global 变量声明（如果有的话）
    var variablesName = [];
    for (var x in Blockly.Python.variables_) {
      variablesName.push(
        Blockly.Python.variables_[x].slice(
          0,
          Blockly.Python.variables_[x].indexOf("=") - 1
        )
      );
    }
    if (variablesName.length !== 0) {
      code += "global " + variablesName.join(", ") + "\n";
    }
    // 不要在这里调用 scrub_，blockToCode 会自动调用 scrub_ 处理后续块
  }

  return code;
};

//暂不支持中文
Blockly.Python["event_whenbroadcastreceived"] = function (block) {
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();

  const broadcast = block.getFieldValue("BROADCAST_INPUT");

  let code = "";

  if (!nextBlock) {
    code += Blockly.Python.INDENT + "\n";
  } else {
    code = Blockly.Python.scrub_(block, code);
  }

  Blockly.Python.msg_[broadcast + ""] =
    `def message${broadcast}Task():\n` +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "while True:\n" +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    `_message.waiteMessageBox(${broadcast})\n` +
    Blockly.Python.addIndent(
      code,
      Blockly.Python.INDENT + Blockly.Python.INDENT + Blockly.Python.INDENT
    ) +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    "_os.sleep_s(0.001)\n" +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    Blockly.Python.INDENT +
    `_message.FlashMessageBox(${broadcast})\n`;

  //不用生成消息对象
  // if (!Blockly.Python.setups_[Blockly.Python.MSG_TYPE]) {
  //   Blockly.Python.setups_[Blockly.Python.MSG_TYPE] = 'MyMsg = APIMessage.box()';
  // }

  return null;
};

Blockly.Python["event_broadcast"] = function (block) {
  const broadcast = block.getFieldValue("BROADCAST_INPUT");
  // TODO: Assemble Python into code variable.
  return Blockly.Python.handleResult(
    `setMessageBox(${broadcast})\n`,
    Blockly.Python.MSG_TYPE
  );
};

Blockly.Python["event_broadcastandwait"] = function (block) {
  const broadcast = block.getFieldValue("BROADCAST_INPUT");
  // TODO: Assemble Python into code variable.
  return Blockly.Python.handleResult(
    `setMessageBoxWaite(${broadcast})\n`,
    Blockly.Python.MSG_TYPE
  );
};

Blockly.Python["event_broadcast_menu"] = function (block) {
  // TODO: Assemble Python into code variable.
  const varName = Blockly.Python.variableDB_.getName(
    block.getFieldValue("BROADCAST_OPTION"),
    Blockly.Variables.NAME_TYPE
  );
  return [varName, Blockly.Python.ORDER_ATOMIC];
};
