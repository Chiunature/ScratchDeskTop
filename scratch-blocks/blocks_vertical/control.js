/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
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

goog.provide("Blockly.Blocks.control");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

Blockly.Blocks["control_forever"] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#5eke39
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "control_forever",
      message0: Blockly.Msg.CONTROL_FOREVER,
      message1: "%1", // Statement
      message2: "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
          width: 32,
          height: 32,
          alt: "*",
          flip_rtl: true,
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_repeat"] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "control_repeat",
      message0: Blockly.Msg.CONTROL_REPEAT,
      message1: "%1", // Statement
      message2: "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "input_value",
          name: "TIMES",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
          width: 32,
          height: 32,
          alt: "*",
          flip_rtl: true,
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_if"] = {
  /**
   * Block for if-then.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "control_if",
      message0: Blockly.Msg.CONTROL_IF,
      message1: "%1", // Statement
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_if_else"] = {
  /**
   * Block for if-else.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "control_if_else",
      message0: Blockly.Msg.CONTROL_IF,
      message1: "%1",
      message2: Blockly.Msg.CONTROL_ELSE,
      message3: "%1",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args3: [
        {
          type: "input_statement",
          name: "SUBSTACK2",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_stop"] = {
  /**
   * Block for stop all scripts.
   * @this Blockly.Block
   */
  init: function () {
    var ALL_SCRIPTS = "all";
    var THIS_SCRIPT = "single";
    var OTHER_SCRIPTS = "other";
    var EXIT = "exit";

    var stopDropdown = new Blockly.FieldDropdown(
      function () {
        if (
          this.sourceBlock_ &&
          this.sourceBlock_.nextConnection &&
          this.sourceBlock_.nextConnection.isConnected()
        ) {
          return [[Blockly.Msg.CONTROL_STOP_EXIT, EXIT]];
        }
        return [
          [Blockly.Msg.CONTROL_STOP_THIS, THIS_SCRIPT],
          [Blockly.Msg.CONTROL_STOP_ALL, ALL_SCRIPTS],
          [Blockly.Msg.CONTROL_STOP_OTHER, OTHER_SCRIPTS],
          [Blockly.Msg.CONTROL_STOP_EXIT, EXIT],
        ];
      },
      function (option) {
        // Create an event group to keep field value and mutator in sync
        // Return null at the end because setValue is called here already.
        Blockly.Events.setGroup(true);
        var oldMutation = Blockly.Xml.domToText(
          this.sourceBlock_.mutationToDom()
        );
        this.sourceBlock_.setNextStatement(option == OTHER_SCRIPTS);
        var newMutation = Blockly.Xml.domToText(
          this.sourceBlock_.mutationToDom()
        );
        Blockly.Events.fire(
          new Blockly.Events.BlockChange(
            this.sourceBlock_,
            "mutation",
            null,
            oldMutation,
            newMutation
          )
        );
        this.setValue(option);
        Blockly.Events.setGroup(false);
        return null;
      }
    );
    this.appendDummyInput()
      .appendField(Blockly.Msg.CONTROL_STOP)
      .appendField(stopDropdown, "STOP_OPTION");
    this.setCategory(Blockly.Categories.control);
    this.setColour(
      Blockly.Colours.control.primary,
      Blockly.Colours.control.secondary,
      Blockly.Colours.control.tertiary
    );
    this.setPreviousStatement(true);
  },
  mutationToDom: function () {
    var container = document.createElement("mutation");
    container.setAttribute("hasnext", this.nextConnection != null);
    return container;
  },
  domToMutation: function (xmlElement) {
    var hasNext = xmlElement.getAttribute("hasnext") == "true";
    this.setNextStatement(hasNext);
  },
};

Blockly.Blocks["control_wait"] = {
  /**
   * Block to wait (pause) stack.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "control_wait",
      message0: Blockly.Msg.CONTROL_WAIT,
      args0: [
        {
          type: "input_value",
          name: "DURATION",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_wait_until"] = {
  /**
   * Block to wait until a condition becomes true.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_WAITUNTIL,
      // "message1": "%1",
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      /* "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ], */
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_repeat_until"] = {
  /**
   * Block to repeat until a condition becomes true.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_REPEATUNTIL,
      message1: "%1",
      message2: "%1",
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
          width: 32,
          height: 32,
          alt: "*",
          flip_rtl: true,
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_while"] = {
  /**
   * Block to repeat until a condition becomes false.
   * (This is an obsolete "hacked" block, for compatibility with 2.0.)
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_WHILE,
      message1: "%1",
      message2: "%1",
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
          width: 32,
          height: 32,
          alt: "*",
          flip_rtl: true,
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_for_each"] = {
  /**
   * Block for for-each. This is an obsolete block that is implemented for
   * compatibility with Scratch 2.0 projects.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      type: "control_for_each",
      message0: Blockly.Msg.CONTROL_FOREACH,
      message1: "%1",
      args0: [
        {
          type: "field_variable",
          name: "VARIABLE",
        },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_start_as_clone"] = {
  /**
   * Block for "when I start as a clone" hat.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "control_start_as_clone",
      message0: Blockly.Msg.CONTROL_STARTASCLONE,
      args0: [],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_hat"],
    });
  },
};

Blockly.Blocks["control_create_clone_of_menu"] = {
  /**
   * Create-clone drop-down menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "CLONE_OPTION",
          options: [[Blockly.Msg.CONTROL_CREATECLONEOF_MYSELF, "_myself_"]],
        },
      ],
      extensions: ["colours_control", "output_string"],
    });
  },
};

Blockly.Blocks["control_create_clone_of"] = {
  /**
   * Block for "create clone of..."
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "control_start_as_clone",
      message0: Blockly.Msg.CONTROL_CREATECLONEOF,
      args0: [
        {
          type: "input_value",
          name: "CLONE_OPTION",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_delete_this_clone"] = {
  /**
   * Block for "delete this clone."
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_DELETETHISCLONE,
      args0: [],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_end"],
    });
  },
};

Blockly.Blocks["control_get_counter"] = {
  /**
   * Block to get the counter value. This is an obsolete block that is
   * implemented for compatibility with Scratch 2.0 projects.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_COUNTER,
      category: Blockly.Categories.control,
      extensions: ["colours_control", "output_number"],
    });
  },
};

Blockly.Blocks["control_incr_counter"] = {
  /**
   * Block to add one to the counter value. This is an obsolete block that is
   * implemented for compatibility with Scratch 2.0 projects.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_INCRCOUNTER,
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_clear_counter"] = {
  /**
   * Block to clear the counter value. This is an obsolete block that is
   * implemented for compatibility with Scratch 2.0 projects.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_CLEARCOUNTER,
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_all_at_once"] = {
  /**
   * Block to run the contained script. This is an obsolete block that is
   * implemented for compatibility with Scratch 2.0 projects. Note that
   * this was originally designed to run all of the contained blocks
   * (sequentially, like normal) within a single frame, but this feature
   * was removed in place of custom blocks marked "run without screen
   * refresh". The "all at once" block was changed to run the contained
   * blocks ordinarily, functioning the same way as an "if" block with a
   * reporter that is always true (e.g. "if 1 = 1"). Also note that the
   * Scratch 2.0 spec for this block is "warpSpeed", but the label shows
   * "all at once".
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_ALLATONCE,
      message1: "%1", // Statement
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_break"] = {
  /**
   * Block to move steps.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.CONTROL_BREAK,
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_end"],
    });
  },
};

// 自定义 Field 用于显示添加 else if 的按钮
Blockly.FieldElseIfButton = function () {
  Blockly.FieldElseIfButton.superClass_.constructor.call(this, "+");
  this.addElseIfCallback_ = null;
  this.clickListener_ = null;
};
goog.inherits(Blockly.FieldElseIfButton, Blockly.FieldLabel);
Blockly.FieldElseIfButton.prototype.init = function () {
  // FieldLabel.init 只负责创建/挂载 textElement_；它本身不会绑定点击事件。
  Blockly.FieldElseIfButton.superClass_.init.call(this);

  // 先解绑旧事件（避免重建/重渲染后重复绑定）
  if (this.clickListener_) {
    Blockly.unbindEvent_(this.clickListener_);
    this.clickListener_ = null;
  }

  // FieldLabel 的根节点就是 textElement_；用 getSvgRoot() 更稳妥
  var clickTarget = this.getSvgRoot ? this.getSvgRoot() : this.textElement_;
  if (!clickTarget) return;

  this.clickListener_ = Blockly.bindEvent_(
    clickTarget,
    "mousedown",
    this,
    function (e) {
      console.log("🖱️ [CLICK] + 按钮被点击！");
      e.stopPropagation();
      e.preventDefault();

      // 优先走外部回调（updateBlock_ 里会赋值），没有则回退到 sourceBlock_ 方法
      if (this.addElseIfCallback_) {
        this.addElseIfCallback_();
        return;
      }
      var b = this.sourceBlock_;
      if (b && b.addElseIf) {
        b.addElseIf();
      }
    }
  );
};

Blockly.FieldElseIfButton.prototype.dispose = function () {
  if (this.clickListener_) {
    Blockly.unbindEvent_(this.clickListener_);
    this.clickListener_ = null;
  }
  Blockly.FieldElseIfButton.superClass_.dispose.call(this);
};
// 重写 render_ 方法，避免重复渲染导致重影
Blockly.FieldElseIfButton.prototype.render_ = function () {
  if (this.visible_ && this.textElement_) {
    // 使用 textContent 而不是 appendChild，避免重复渲染
    this.textElement_.textContent = "+";

    // 确保样式正确应用（每次渲染时都设置，防止被覆盖）
    this.textElement_.style.cursor = "pointer";
    this.textElement_.style.fill = "#fff";
    this.textElement_.style.fontWeight = "bold";
    this.textElement_.style.fontSize = "36px"; // 增大字体到 22px
    this.textElement_.style.fontFamily = "Arial, sans-serif";
    this.textElement_.style.userSelect = "none";
    this.textElement_.style.pointerEvents = "all";

    // 更新宽度
    this.updateWidth();

    // 设置位置（参考 Field.prototype.render_）
    var centerTextX = (this.size_.width - this.arrowWidth_) / 2;
    if (this.sourceBlock_ && this.sourceBlock_.RTL) {
      centerTextX += this.arrowWidth_;
    }

    // 对于非 shadow block，使用最小偏移量
    if (
      this.sourceBlock_ &&
      !this.sourceBlock_.isShadow() &&
      !this.positionArrow
    ) {
      var minOffset = Blockly.BlockSvg.FIELD_WIDTH / 2;
      if (this.sourceBlock_.RTL) {
        var minCenter = this.size_.width - minOffset;
        centerTextX = Math.min(minCenter, centerTextX);
      } else {
        centerTextX = Math.max(minOffset, centerTextX);
      }
    }

    // 应用位置
    this.textElement_.setAttribute("x", centerTextX);
  }
};

Blockly.Field.register("field_elseif_button", {
  fromJson: function (options) {
    return new Blockly.FieldElseIfButton();
  },
});

// 自定义 Field 用于显示删除 else if 的按钮（删除最后一个 elseif 分支）
Blockly.FieldElseIfRemoveButton = function () {
  Blockly.FieldElseIfRemoveButton.superClass_.constructor.call(this, "−");
  this.removeElseIfCallback_ = null;
  this.clickListener_ = null;
};
goog.inherits(Blockly.FieldElseIfRemoveButton, Blockly.FieldLabel);

Blockly.FieldElseIfRemoveButton.prototype.init = function () {
  Blockly.FieldElseIfRemoveButton.superClass_.init.call(this);

  // 先解绑旧事件（避免重建/重渲染后重复绑定）
  if (this.clickListener_) {
    Blockly.unbindEvent_(this.clickListener_);
    this.clickListener_ = null;
  }

  var clickTarget = this.getSvgRoot ? this.getSvgRoot() : this.textElement_;
  if (!clickTarget) return;

  this.clickListener_ = Blockly.bindEvent_(
    clickTarget,
    "mousedown",
    this,
    function (e) {
      e.stopPropagation();
      e.preventDefault();

      // 优先走外部回调（updateBlock_ 里会赋值），没有则回退到 sourceBlock_ 方法
      if (this.removeElseIfCallback_) {
        this.removeElseIfCallback_();
        return;
      }
      var b = this.sourceBlock_;
      if (b && b.removeElseIf) {
        b.removeElseIf();
      }
    }
  );
};

Blockly.FieldElseIfRemoveButton.prototype.dispose = function () {
  if (this.clickListener_) {
    Blockly.unbindEvent_(this.clickListener_);
    this.clickListener_ = null;
  }
  Blockly.FieldElseIfRemoveButton.superClass_.dispose.call(this);
};

// 重写 render_ 方法，避免重复渲染导致重影
Blockly.FieldElseIfRemoveButton.prototype.render_ = function () {
  if (this.visible_ && this.textElement_) {
    this.textElement_.textContent = "−";

    this.textElement_.style.cursor = "pointer";
    this.textElement_.style.fill = "#fff";
    this.textElement_.style.fontWeight = "bold";
    this.textElement_.style.fontSize = "36px";
    this.textElement_.style.fontFamily = "Arial, sans-serif";
    this.textElement_.style.userSelect = "none";
    this.textElement_.style.pointerEvents = "all";

    this.updateWidth();

    var centerTextX = (this.size_.width - this.arrowWidth_) / 2;
    if (this.sourceBlock_ && this.sourceBlock_.RTL) {
      centerTextX += this.arrowWidth_;
    }

    if (
      this.sourceBlock_ &&
      !this.sourceBlock_.isShadow() &&
      !this.positionArrow
    ) {
      var minOffset = Blockly.BlockSvg.FIELD_WIDTH / 2;
      if (this.sourceBlock_.RTL) {
        var minCenter = this.size_.width - minOffset;
        centerTextX = Math.min(minCenter, centerTextX);
      } else {
        centerTextX = Math.max(minOffset, centerTextX);
      }
    }

    this.textElement_.setAttribute("x", centerTextX);
  }
};

Blockly.Field.register("field_remove_elseif_button", {
  fromJson: function (options) {
    return new Blockly.FieldElseIfRemoveButton();
  },
});

Blockly.Blocks["control_if_elseif_else"] = {
  /**
   * Block for if-elseif-else with dynamic else if branches.
   * @this Blockly.Block
   */
  init: function () {
    // 初始化 else if 分支数量（默认为1个）
    this.elseIfCount_ = this.elseIfCount_ || 1;

    this.updateBlock_();
  },

  /**
   * 更新积木块结构
   * @private
   */
  updateBlock_: function () {
    // 获取调用者信息（可选）
    try {
      throw new Error();
    } catch (e) {
      const stack = e.stack.split("\n")[2]; // 取上一层调用
      console.log("🔄 [UPDATE] updateBlock_ 被调用 from:", stack.trim());
    }

    console.log(
      "🛠️ [UPDATE] 开始重建 block，当前 elseIfCount_ =",
      this.elseIfCount_
    );
    // 保存当前连接的值
    var savedValues = {};
    var savedStatements = {};

    // 保存所有条件输入的值
    if (this.getInput("CONDITION")) {
      var targetBlock = this.getInput("CONDITION").connection.targetBlock();
      if (targetBlock) {
        savedValues["CONDITION"] = targetBlock;
      }
    }

    // 保存所有语句输入的值
    if (this.getInput("SUBSTACK")) {
      var targetBlock = this.getInput("SUBSTACK").connection.targetBlock();
      if (targetBlock) {
        savedStatements["SUBSTACK"] = targetBlock;
      }
    }

    for (var i = 0; i < (this.elseIfCount_ || 1); i++) {
      var condName = "CONDITION" + (i + 2);
      var stackName = "SUBSTACK" + (i + 2);
      if (this.getInput(condName)) {
        var targetBlock = this.getInput(condName).connection.targetBlock();
        if (targetBlock) {
          savedValues[condName] = targetBlock;
        }
      }
      if (this.getInput(stackName)) {
        var targetBlock = this.getInput(stackName).connection.targetBlock();
        if (targetBlock) {
          savedStatements[stackName] = targetBlock;
        }
      }
    }

    // 保存 else 分支
    if (this.getInput("SUBSTACK_ELSE")) {
      var targetBlock = this.getInput("SUBSTACK_ELSE").connection.targetBlock();
      if (targetBlock) {
        savedStatements["SUBSTACK_ELSE"] = targetBlock;
      }
    }

    // 清除所有输入（正确地销毁 Field 对象）
    while (this.inputList.length > 0) {
      this.removeInput(this.inputList[0].name);
    }

    // 构建消息和参数数组
    var messages = [];
    var args = [];
    var msgIndex = 0;

    // message0: if %1 then
    // 在 if 前添加 "+" 按钮："%1 if %2 then"
    var ifMsg = Blockly.Msg.CONTROL_IF; // "if %1 then"
    messages[msgIndex] = "%1 " + ifMsg.replace("%1", "%2");
    args[msgIndex] = [
      {
        type: "field_elseif_button",
        name: "ADD_ELSEIF_TOP",
      },
      {
        type: "input_value",
        name: "CONDITION",
        check: "Boolean",
      },
    ];
    msgIndex++;

    // message1: %1 (语句)
    messages[msgIndex] = "%1";
    args[msgIndex] = [
      {
        type: "input_statement",
        name: "SUBSTACK",
      },
    ];
    msgIndex++;

    // 添加 else if 分支
    for (var i = 0; i < this.elseIfCount_; i++) {
      //唯一名称
      const removeFieldName = "REMOVE_ELSEIF_" + i;

      const elseIfMsg = Blockly.Msg.CONTROL_ELSEIF;
      messages[msgIndex] = "%1 " + elseIfMsg.replace("%1", "%2");
      args[msgIndex] = [
        {
          type: "field_remove_elseif_button",
          name: removeFieldName,
        },
        {
          type: "input_value",
          name: "CONDITION" + (i + 2),
          check: "Boolean",
        },
      ];
      msgIndex++;

      // %1 (语句)
      messages[msgIndex] = "%1";
      args[msgIndex] = [
        {
          type: "input_statement",
          name: "SUBSTACK" + (i + 2),
        },
      ];
      msgIndex++;
    }

    // else
    messages[msgIndex] = Blockly.Msg.CONTROL_ELSE;
    // else 没有参数，所以不添加 args
    msgIndex++;

    // %1 (else 语句)
    messages[msgIndex] = "%1";
    args[msgIndex] = [
      {
        type: "input_statement",
        name: "SUBSTACK_ELSE",
      },
    ];

    // 构建 jsonInit 对象
    var jsonDef = {
      type: "control_if_elseif_else",
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    };

    // 添加所有消息和参数
    for (var i = 0; i < messages.length; i++) {
      jsonDef["message" + i] = messages[i];
      if (args[i]) {
        jsonDef["args" + i] = args[i];
      }
    }

    console.log("🔧 [DEBUG] 准备重建 block，elseIfCount =", this.elseIfCount_);
    console.log("🔧 [DEBUG] 消息结构:", messages);
    console.log("🔧 [DEBUG] 参数结构:", args);
    // 重新初始化
    this.jsonInit(jsonDef);

    console.log("🔧 [DEBUG] 最终 jsonDef:", JSON.stringify(jsonDef, null, 2));

    // 恢复连接的值
    for (var name in savedValues) {
      if (savedValues[name] && this.getInput(name)) {
        try {
          this.getInput(name).connection.connect(
            savedValues[name].outputConnection
          );
        } catch (e) {
          // 连接失败，忽略
        }
      }
    }

    for (var name in savedStatements) {
      if (savedStatements[name] && this.getInput(name)) {
        try {
          this.getInput(name).connection.connect(
            savedStatements[name].previousConnection
          );
        } catch (e) {
          // 连接失败，忽略
        }
      }
    }

    // 绑定按钮回调 - 延迟执行以确保 Field 已初始化
    var self = this;
    // 只有在 block 已经渲染到 workspace 后才强制重绘
    if (this.rendered) {
      this.render();
    }

    this.inputList.forEach((input) => {
      console.log(input.name + ": connection=" + !!input.connection);
    });

    setTimeout(function () {
      var addButtonField = self.getField("ADD_ELSEIF_TOP");
      if (addButtonField) {
        addButtonField.addElseIfCallback_ = function () {
          self.addElseIf();
        };
      }

      // 遍历所有 REMOVE_ELSEIF_X 字段，全部绑定到 removeElseIf()
      for (var i = 0; i < self.elseIfCount_; i++) {
        const removeFieldName = "REMOVE_ELSEIF_" + i;
        const field = self.getField(removeFieldName);
        if (field) {
          // 所有按钮都执行同一个操作：删除最后一个 elseif
          field.removeElseIfCallback_ = function () {
            self.removeElseIf();
          };
        }
      }
    }, 0);
  },

  /**
   * 添加一个 else if 分支
   */
  addElseIf: function () {
    console.log(
      "🟢 [ACTION] addElseIf() 被调用！当前 elseIfCount_ =",
      this.elseIfCount_
    );
    Blockly.Events.setGroup(true);
    var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
    this.elseIfCount_ = (this.elseIfCount_ || 1) + 1;
    console.log("   → 增加后 elseIfCount_ =", this.elseIfCount_);
    this.updateBlock_();
    var newMutation = Blockly.Xml.domToText(this.mutationToDom());
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(
        this,
        "mutation",
        null,
        oldMutation,
        newMutation
      )
    );
    Blockly.Events.setGroup(false);
  },

  /**
   * 删除一个 else if 分支（默认删除最后一个）
   */
  removeElseIf: function () {
    console.log(
      "🔴 [ACTION] removeElseIf() 被调用！当前 elseIfCount_ =",
      this.elseIfCount_
    );
    if ((this.elseIfCount_ || 1) <= 1) {
      console.log("   → 不允许删除，返回");
      return;
    }
    console.log("   → 删除后 elseIfCount_ =", this.elseIfCount_);
    Blockly.Events.setGroup(true);
    var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
    this.elseIfCount_ = (this.elseIfCount_ || 1) - 1;
    this.updateBlock_();
    var newMutation = Blockly.Xml.domToText(this.mutationToDom());
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(
        this,
        "mutation",
        null,
        oldMutation,
        newMutation
      )
    );
    Blockly.Events.setGroup(false);
  },

  /**
   * 保存变异信息到 DOM
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    container.setAttribute("elseifcount", this.elseIfCount_ || 1);
    return container;
  },

  /**
   * 从 DOM 恢复变异信息
   */
  domToMutation: function (xmlElement) {
    this.elseIfCount_ = parseInt(
      xmlElement.getAttribute("elseifcount") || "1",
      10
    );
    this.updateBlock_();
  },
};
