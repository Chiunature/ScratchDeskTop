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

/**
 * @fileoverview 7×13 矩阵输入字段。
 * 用于点阵/LED 的 7 行 13 列可编辑矩阵。
 * @author khanning@gmail.com (Kreg Hanning)
 */
"use strict";

goog.provide("Blockly.FieldMatrix");

goog.require("Blockly.DropDownDiv");

/**
 * 矩阵字段类。
 * @param {string} matrix 默认矩阵字符串（91 个字符，行优先，7×13）。
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldMatrix = function (matrix) {
  var norm = matrix;
  if (!norm || typeof norm !== "string") {
    norm = Blockly.FieldMatrix.ZEROS;
  } else if (norm.length < Blockly.FieldMatrix.MATRIX_LEN) {
    norm =
      norm +
      Blockly.FieldMatrix.ZEROS.substring(
        0,
        Blockly.FieldMatrix.MATRIX_LEN - norm.length
      );
  }
  Blockly.FieldMatrix.superClass_.constructor.call(this, norm);
  this.addArgType("matrix");
  /**
   * 积木上缩略图：每个 LED 对应一个 rect。
   * @type {!Array<SVGElement>}
   * @private
   */
  this.ledThumbNodes_ = [];
  /**
   * 下拉编辑器中的矩阵格子 rect 列表。
   * @type {!Array<SVGElement>}
   * @private
   */
  this.ledButtons_ = [];
  /**
   * 当前矩阵取值字符串（仅含 '0'/'1'）。
   * @type {!String}
   * @private
   */
  this.matrix_ = norm;
  /**
   * 编辑器中矩阵的 SVG 根节点。
   * @type {?SVGElement}
   * @private
   */
  this.matrixStage_ = null;
  /**
   * 下拉箭头所用的 SVG image。
   * @type {?SVGElement}
   * @private
   */
  this.arrow_ = null;
  /**
   * 拖拽涂色模式：null | 'fill'（点亮）| 'clear'（熄灭）。
   * @type {?String}
   * @private
   */
  this.paintStyle_ = null;
  /**
   * 字段被按下时的事件绑定（mousedown）。
   * @type {!Array}
   * @private
   */
  this.mouseDownWrapper_ = null;
  /**
   * 「清空」按钮点击事件绑定。
   * @type {!Array}
   * @private
   */
  this.clearButtonWrapper_ = null;
  /**
   * 「全亮」按钮点击事件绑定。
   * @type {!Array}
   * @private
   */
  this.fillButtonWrapper_ = null;
  /**
   * 矩阵区域 mousedown 事件绑定。
   * @type {!Array}
   * @private
   */
  this.matrixTouchWrapper_ = null;
  /**
   * 拖拽过程中 document 上 mousemove 绑定。
   * @type {!Array}
   * @private
   */
  this.matrixMoveWrapper_ = null;
  /**
   * 拖拽结束 mouseup 绑定。
   * @type {!Array}
   * @private
   */
  this.matrixReleaseWrapper_ = null;
};

/**
 * 矩阵尺寸（行优先：下标 = 行 * COLS + 列）。
 * 必须在首次 {@code new Blockly.FieldMatrix(...)} 之前赋值完毕。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.MATRIX_ROWS = 7;
Blockly.FieldMatrix.MATRIX_COLS = 13;
Blockly.FieldMatrix.MATRIX_LEN =
  Blockly.FieldMatrix.MATRIX_ROWS * Blockly.FieldMatrix.MATRIX_COLS;
Blockly.FieldMatrix.ZEROS = new Array(Blockly.FieldMatrix.MATRIX_LEN + 1).join(
  "0"
);
Blockly.FieldMatrix.ONES = new Array(Blockly.FieldMatrix.MATRIX_LEN + 1).join(
  "1"
);

goog.inherits(Blockly.FieldMatrix, Blockly.Field);

/**
 * 由 JSON 参数构造 FieldMatrix（与 field_matrix 的 JSON 定义对应）。
 * @param {!Object} options 含 matrix 等选项的对象。
 * @returns {!Blockly.FieldMatrix} 新字段实例。
 * @package
 * @nocollapse
 */
Blockly.FieldMatrix.fromJson = function (options) {
  return new Blockly.FieldMatrix(options["matrix"]);
};

/**
 * 积木上缩略图区域宽度基准，单位 px。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.THUMBNAIL_SIZE = 68;

/**
 * 缩略图中每个小格子的边长，单位 px。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.THUMBNAIL_NODE_SIZE = 4;

/**
 * 缩略图格子间距，单位 px。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.THUMBNAIL_NODE_PAD = 1;

/**
 * 下拉箭头图标尺寸，单位 px。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.ARROW_SIZE = 12;

/**
 * 编辑器里矩阵格子的边长，单位 px。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.MATRIX_NODE_SIZE = 18;

/**
 * 编辑器格子的圆角半径，单位 px。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.MATRIX_NODE_RADIUS = 4;

/**
 * 编辑器格子水平/列方向的间距，单位 px。
 * @type {number}
 * @const
 */
Blockly.FieldMatrix.MATRIX_NODE_PAD = 7;
/** 编辑器格子竖直（行）方向间距，单位 px。 */
Blockly.FieldMatrix.MATRIX_NODE_PAD_TWO = 9;

/** 防抖定时器句柄（与 {@link Blockly.FieldMatrix.callback} 配合）。 */
Blockly.FieldMatrix.timer = null;
/** 矩阵变更时外部回调，签名为 function(type, payload)。 */
Blockly.FieldMatrix.callback = null;
/**
 * 字段挂到积木上时调用，创建缩略图与箭头。
 * @this {Blockly.FieldMatrix}
 */
Blockly.FieldMatrix.prototype.init = function () {
  if (this.fieldGroup_) {
    // 已初始化过，直接返回。
    return;
  }

  // 如需跟随父积木着色，可取消下面注释。
  /* if (this.sourceBlock_.getParent()) {
    var parentBlock = this.sourceBlock_.getParent();
    this.sourceBlock_.setColour(parentBlock.getColour(), parentBlock.getColourSecondary(),
      parentBlock.getColourTertiary());
  } */

  // 构建字段的 SVG DOM。
  this.fieldGroup_ = Blockly.utils.createSvgElement("g", {}, null);
  this.size_.width =
    Blockly.FieldMatrix.THUMBNAIL_SIZE +
    Blockly.FieldMatrix.ARROW_SIZE +
    Blockly.BlockSvg.DROPDOWN_ARROW_PADDING * 1.5;

  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);

  var thumbX = Blockly.BlockSvg.DROPDOWN_ARROW_PADDING / 2;
  // var thumbY = (this.size_.height - Blockly.FieldMatrix.THUMBNAIL_SIZE) / 2;
  var thumbY = -7;
  var thumbnail = Blockly.utils.createSvgElement(
    "g",
    {
      transform: "translate(" + thumbX + ", " + thumbY + ")",
      "pointer-events": "bounding-box",
      cursor: "pointer",
    },
    this.fieldGroup_
  );
  this.ledThumbNodes_ = [];
  var nodeSize = Blockly.FieldMatrix.THUMBNAIL_NODE_SIZE;
  var nodePad = Blockly.FieldMatrix.THUMBNAIL_NODE_PAD;
  for (var i = 0; i < Blockly.FieldMatrix.MATRIX_ROWS; i++) {
    for (var n = 0; n < Blockly.FieldMatrix.MATRIX_COLS; n++) {
      var attr = {
        x: (nodeSize + nodePad) * n + nodePad,
        y: (nodeSize + nodePad) * i + nodePad,
        width: nodeSize,
        height: nodeSize,
        rx: nodePad,
        ry: nodePad,
      };
      this.ledThumbNodes_.push(
        Blockly.utils.createSvgElement("rect", attr, thumbnail)
      );
    }
    thumbnail.style.cursor = "default";
  }

  this.updateMatrix_();

  if (!this.arrow_) {
    var arrowX =
      Blockly.FieldMatrix.THUMBNAIL_SIZE +
      Blockly.BlockSvg.DROPDOWN_ARROW_PADDING * 1.5;
    var arrowY = (this.size_.height - Blockly.FieldMatrix.ARROW_SIZE) / 2;
    this.arrow_ = Blockly.utils.createSvgElement(
      "image",
      {
        height: Blockly.FieldMatrix.ARROW_SIZE + "px",
        width: Blockly.FieldMatrix.ARROW_SIZE + "px",
        transform: "translate(" + (arrowX + 3) + ", " + (arrowY + 2) + ")",
      },
      this.fieldGroup_
    );
    this.arrow_.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      Blockly.mainWorkspace.options.pathToMedia + "dropdown-arrow.svg"
    );
    this.arrow_.style.cursor = "default";
  }

  this.mouseDownWrapper_ = Blockly.bindEventWithChecks_(
    this.getClickTarget_(),
    "mousedown",
    this,
    this.onMouseDown_
  );
};

/**
 * 设置矩阵字符串；不足 MATRIX_LEN 时右侧用 '0' 补齐。
 * @param {string} matrix 新值（行优先，最终长度为 MATRIX_LEN）。
 * @override
 */
Blockly.FieldMatrix.prototype.setValue = function (matrix) {
  if (!matrix || matrix === this.matrix_) {
    return; // 无变化
  }
  if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
    Blockly.Events.fire(
      new Blockly.Events.Change(
        this.sourceBlock_,
        "field",
        this.name,
        this.matrix_,
        matrix
      )
    );
  }
  matrix =
    matrix +
    Blockly.FieldMatrix.ZEROS.substr(
      0,
      Blockly.FieldMatrix.MATRIX_LEN - matrix.length
    );
  this.matrix_ = matrix;
  this.updateMatrix_();
};

Blockly.FieldMatrix.prototype.stringToHex = function (matrix) {
  // 每行 MATRIX_COLS 个字符（7 行 × 13 列）；按列读取 7 位再反转，得到每列一个字节数值。
  var cols = Blockly.FieldMatrix.MATRIX_COLS;
  var rows = Blockly.FieldMatrix.MATRIX_ROWS;
  var matrixArr = matrix.match(new RegExp(".{1," + cols + "}", "g")) || [];
  var hexArr = [];

  for (var col = 0; col < cols; col++) {
    var columnBits = "";
    for (var row = 0; row < rows; row++) {
      if (matrixArr[row] && matrixArr[row][col]) {
        columnBits += matrixArr[row][col];
      } else {
        columnBits += "0";
      }
    }
    columnBits = columnBits.split("").reverse().join("");
    var decimalNum = parseInt(columnBits, 2);
    hexArr.push(decimalNum);
  }
  return hexArr;
};

/**
 * 获取当前矩阵字符串。
 * @return {string} 当前矩阵值。
 */
Blockly.FieldMatrix.prototype.getValue = function () {
  return String(this.matrix_);
};

/**
 * 打开下拉编辑器（矩阵 + 清空/全亮按钮）。
 * @private
 */
Blockly.FieldMatrix.prototype.showEditor_ = function () {
  // 若已有其他下拉层，先关闭并清空。
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var div = Blockly.DropDownDiv.getContentDiv();
  // 构建编辑器内矩阵 SVG。
  var cols = Blockly.FieldMatrix.MATRIX_COLS;
  var rows = Blockly.FieldMatrix.MATRIX_ROWS;
  // 宽度按列数计算（x 方向使用 MATRIX_NODE_PAD）
  var matrixWidth =
    Blockly.FieldMatrix.MATRIX_NODE_SIZE * cols +
    Blockly.FieldMatrix.MATRIX_NODE_PAD * (cols + 1);
  // 高度按行数计算（y 方向使用 MATRIX_NODE_PAD_TWO）
  var matrixHeight =
    Blockly.FieldMatrix.MATRIX_NODE_SIZE * rows +
    Blockly.FieldMatrix.MATRIX_NODE_PAD_TWO * (rows + 1);
  this.matrixStage_ = Blockly.utils.createSvgElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:html": "http://www.w3.org/1999/xhtml",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      version: "1.1",
      height: matrixHeight + "px",
      width: matrixWidth + "px",
      // Provide a viewBox so the grid scales correctly with the dropdown layout.
      viewBox: "0 0 " + matrixWidth + " " + matrixHeight,
      preserveAspectRatio: "xMinYMin meet",
    },
    div
  );
  this.ledButtons_ = [];
  for (var i = 0; i < Blockly.FieldMatrix.MATRIX_ROWS; i++) {
    for (var n = 0; n < cols; n++) {
      var x =
        Blockly.FieldMatrix.MATRIX_NODE_SIZE * n +
        Blockly.FieldMatrix.MATRIX_NODE_PAD * (n + 1);
      var y =
        Blockly.FieldMatrix.MATRIX_NODE_SIZE * i +
        Blockly.FieldMatrix.MATRIX_NODE_PAD_TWO * (i + 1);
      var attr = {
        x: x,
        y: y,
        width: Blockly.FieldMatrix.MATRIX_NODE_SIZE,
        height: Blockly.FieldMatrix.MATRIX_NODE_SIZE,
        rx: Blockly.FieldMatrix.MATRIX_NODE_RADIUS,
        ry: Blockly.FieldMatrix.MATRIX_NODE_RADIUS,
      };
      var led = Blockly.utils.createSvgElement("rect", attr, this.matrixStage_);
      this.matrixStage_.appendChild(led);
      this.ledButtons_.push(led);
    }
  }
  // 下方按钮区域容器。
  var buttonDiv = document.createElement("div");
  // 「清空矩阵」
  var clearButtonDiv = document.createElement("div");
  clearButtonDiv.className = "scratchMatrixButtonDiv";
  var clearButton = this.createButton_(this.sourceBlock_.colourSecondary_);
  clearButtonDiv.appendChild(clearButton);
  // 「全部点亮」
  var fillButtonDiv = document.createElement("div");
  fillButtonDiv.className = "scratchMatrixButtonDiv";
  var fillButton = this.createButton_("#FFFFFF");
  fillButtonDiv.appendChild(fillButton);

  buttonDiv.appendChild(clearButtonDiv);
  buttonDiv.appendChild(fillButtonDiv);
  div.appendChild(buttonDiv);

  Blockly.DropDownDiv.setColour(
    this.sourceBlock_.getColour(),
    this.sourceBlock_.getColourTertiary()
  );
  Blockly.DropDownDiv.setCategory(this.sourceBlock_.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  this.matrixTouchWrapper_ = Blockly.bindEvent_(
    this.matrixStage_,
    "mousedown",
    this,
    this.onMouseDown
  );
  this.clearButtonWrapper_ = Blockly.bindEvent_(
    clearButton,
    "click",
    this,
    this.clearMatrix_
  );
  this.fillButtonWrapper_ = Blockly.bindEvent_(
    fillButton,
    "click",
    this,
    this.fillMatrix_
  );

  // 按当前 matrix_ 刷新格子显示。
  this.updateMatrix_();
};

// 调试用：历史上遗留的全局函数写法，不应作为实例方法使用。
this.nodeCallback_ = function (e, num) {
  console.log(num);
};

/**
 * 绘制 3×3 小点阵样式的 SVG 按钮图标。
 * @param {string} fill 填充色。
 * @return {SvgElement} 按钮 SVG 根元素。
 */
Blockly.FieldMatrix.prototype.createButton_ = function (fill) {
  var button = Blockly.utils.createSvgElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:html": "http://www.w3.org/1999/xhtml",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    version: "1.1",
    height: Blockly.FieldMatrix.MATRIX_NODE_SIZE + "px",
    width: Blockly.FieldMatrix.MATRIX_NODE_SIZE + "px",
  });
  var nodeSize = Blockly.FieldMatrix.MATRIX_NODE_SIZE / 4;
  var nodePad = Blockly.FieldMatrix.MATRIX_NODE_SIZE / 16;
  for (var i = 0; i < 3; i++) {
    for (var n = 0; n < 3; n++) {
      Blockly.utils.createSvgElement(
        "rect",
        {
          x: (nodeSize + nodePad) * n + nodePad,
          y: (nodeSize + nodePad) * i + nodePad,
          width: nodeSize,
          height: nodeSize,
          rx: nodePad,
          ry: nodePad,
          fill: fill,
        },
        button
      );
    }
  }
  return button;
};

/**
 * 根据 matrix_ 重绘缩略图与编辑器中的格子颜色。
 * @private
 */
Blockly.FieldMatrix.prototype.updateMatrix_ = function () {
  for (var i = 0; i < this.matrix_.length; i++) {
    if (this.matrix_[i] === "0") {
      this.fillMatrixNode_(
        this.ledButtons_,
        i,
        this.sourceBlock_.colourSecondary_
      );
      this.fillMatrixNode_(this.ledThumbNodes_, i, this.sourceBlock_.colour_);
    } else {
      this.fillMatrixNode_(this.ledButtons_, i, "#FFFFFF");
      this.fillMatrixNode_(this.ledThumbNodes_, i, "#FFFFFF");
    }
  }
};

/**
 * 通知外部矩阵已变更（100ms 防抖）；type 为 'change' 时 payload.matrix 为按列字节数组。
 * @param {string} type 事件类型。
 * @param {*} value 非 change 时传入的附加数据。
 */
Blockly.FieldMatrix.prototype.changeMatrix = function (type, value) {
  if (typeof Blockly.FieldMatrix.callback === "function") {
    clearTimeout(Blockly.FieldMatrix.timer);
    const that = this;
    Blockly.FieldMatrix.timer = setTimeout(() => {
      switch (type) {
        case "change":
          let lp = that.stringToHex(that.matrix_);
          Blockly.FieldMatrix.callback(type, { matrix: lp });
          break;
        default:
          Blockly.FieldMatrix.callback(type, { matrix: value });
          break;
      }
    }, 100);
  }
};

/**
 * 清空矩阵（全 0）。
 * @param {!Event} e 鼠标事件。
 */
Blockly.FieldMatrix.prototype.clearMatrix_ = function (e) {
  if (e.button != 0) return;
  this.setValue(Blockly.FieldMatrix.ZEROS);
  this.changeMatrix("change");
};

/**
 * 点亮全部格子（全 1）。
 * @param {!Event} e 鼠标事件。
 */
Blockly.FieldMatrix.prototype.fillMatrix_ = function (e) {
  if (e.button != 0) return;
  this.setValue(Blockly.FieldMatrix.ONES);
  this.changeMatrix("change");
};

/**
 * 将指定下标的格子设为给定填充色。
 * @param {!Array<SVGElement>} node 格子 SVG 数组。
 * @param {!number} index 下标。
 * @param {!string} fill '#rrggbb' 格式颜色。
 */
Blockly.FieldMatrix.prototype.fillMatrixNode_ = function (node, index, fill) {
  if (!node || !node[index] || !fill) return;
  node[index].setAttribute("fill", fill);
};

/** 将下标 led 的格子设为 state（'0' 或 '1'），并触发 changeMatrix。 */
Blockly.FieldMatrix.prototype.setLEDNode_ = function (led, state) {
  if (led < 0 || led >= Blockly.FieldMatrix.MATRIX_LEN) return;
  var matrix =
    this.matrix_.substr(0, led) + state + this.matrix_.substr(led + 1);
  this.setValue(matrix);
  this.changeMatrix("change");
};

/** 点亮下标 led。 */
Blockly.FieldMatrix.prototype.fillLEDNode_ = function (led) {
  if (led < 0 || led >= Blockly.FieldMatrix.MATRIX_LEN) return;
  this.setLEDNode_(led, "1");
};

/** 熄灭下标 led。 */
Blockly.FieldMatrix.prototype.clearLEDNode_ = function (led) {
  if (led < 0 || led >= Blockly.FieldMatrix.MATRIX_LEN) return;
  this.setLEDNode_(led, "0");
};

/** 切换下标 led 的亮灭。 */
Blockly.FieldMatrix.prototype.toggleLEDNode_ = function (led) {
  if (led < 0 || led >= Blockly.FieldMatrix.MATRIX_LEN) return;
  if (this.matrix_.charAt(led) === "0") {
    this.setLEDNode_(led, "1");
  } else {
    this.setLEDNode_(led, "0");
  }
};

/**
 * 在编辑器内按下：开始拖拽涂色，并切换起点格子。
 * @param {!Event} e 鼠标事件。
 */
Blockly.FieldMatrix.prototype.onMouseDown = function (e) {
  this.matrixMoveWrapper_ = Blockly.bindEvent_(
    document.body,
    "mousemove",
    this,
    this.onMouseMove
  );
  this.matrixReleaseWrapper_ = Blockly.bindEvent_(
    document.body,
    "mouseup",
    this,
    this.onMouseUp
  );
  var ledHit = this.checkForLED_(e);
  if (ledHit > -1) {
    if (this.matrix_.charAt(ledHit) === "0") {
      this.paintStyle_ = "fill";
    } else {
      this.paintStyle_ = "clear";
    }
    this.toggleLEDNode_(ledHit);
    this.updateMatrix_();
  } else {
    this.paintStyle_ = null;
  }
};

/**
 * 释放鼠标：解绑移动监听并结束涂色模式。
 */
Blockly.FieldMatrix.prototype.onMouseUp = function () {
  Blockly.unbindEvent_(this.matrixMoveWrapper_);
  Blockly.unbindEvent_(this.matrixReleaseWrapper_);
  this.paintStyle_ = null;
};

/**
 * 拖拽时连续点亮或熄灭经过的格子。
 * @param {!Event} e 鼠标移动事件。
 */
Blockly.FieldMatrix.prototype.onMouseMove = function (e) {
  e.preventDefault();
  if (this.paintStyle_) {
    var led = this.checkForLED_(e);
    if (led < 0) return;
    if (this.paintStyle_ === "clear") {
      this.clearLEDNode_(led);
    } else if (this.paintStyle_ === "fill") {
      this.fillLEDNode_(led);
    }
  }
};

/**
 * 根据鼠标坐标命中矩阵格子，返回线性下标；未命中返回 -1。
 * @param {!Event} e 鼠标事件。
 * @return {number} 格子下标，或 -1。
 */
Blockly.FieldMatrix.prototype.checkForLED_ = function (e) {
  var bBox = this.matrixStage_.getBoundingClientRect();
  var nodeSize = Blockly.FieldMatrix.MATRIX_NODE_SIZE;
  var nodePad = Blockly.FieldMatrix.MATRIX_NODE_PAD;
  var nodePadTwo = Blockly.FieldMatrix.MATRIX_NODE_PAD_TWO;
  var dx = e.clientX - bBox.left;
  var dy = e.clientY - bBox.top;

  // Convert from screen pixels to SVG user coordinates.
  // This keeps hit-testing correct when the SVG is scaled by the layout.
  var viewBox = this.matrixStage_.getAttribute("viewBox");
  var vbW = bBox.width;
  var vbH = bBox.height;
  if (viewBox) {
    var parts = viewBox.split(/\s+/);
    if (parts.length === 4) {
      vbW = parseFloat(parts[2]);
      vbH = parseFloat(parts[3]);
    }
  }
  var x = dx * (vbW / bBox.width);
  var y = dy * (vbH / bBox.height);

  var xDiv = Math.trunc((x - nodePad / 2) / (nodeSize + nodePad));
  var yDiv = Math.trunc((y - nodePadTwo / 2) / (nodeSize + nodePadTwo));
  if (
    xDiv < 0 ||
    xDiv >= Blockly.FieldMatrix.MATRIX_COLS ||
    yDiv < 0 ||
    yDiv >= Blockly.FieldMatrix.MATRIX_ROWS
  ) {
    return -1;
  }
  return xDiv + yDiv * Blockly.FieldMatrix.MATRIX_COLS;
};

/**
 * 销毁时解绑事件、释放引用（与继承的 Field 一起清理）。
 * @return {!Function} WidgetDiv 销毁时要执行的闭包。
 * @private
 */
Blockly.FieldMatrix.prototype.dispose_ = function () {
  var thisField = this;
  return function () {
    Blockly.FieldMatrix.superClass_.dispose_.call(thisField)();
    thisField.matrixStage_ = null;
    if (thisField.mouseDownWrapper_) {
      Blockly.unbindEvent_(thisField.mouseDownWrapper_);
    }
    if (thisField.matrixTouchWrapper_) {
      Blockly.unbindEvent_(thisField.matrixTouchWrapper_);
    }
    if (thisField.matrixReleaseWrapper_) {
      Blockly.unbindEvent_(thisField.matrixReleaseWrapper_);
    }
    if (thisField.matrixMoveWrapper_) {
      Blockly.unbindEvent_(thisField.matrixMoveWrapper_);
    }
    if (thisField.clearButtonWrapper_) {
      Blockly.unbindEvent_(thisField.clearButtonWrapper_);
    }
    if (thisField.fillButtonWrapper_) {
      Blockly.unbindEvent_(thisField.fillButtonWrapper_);
    }
  };
};

Blockly.Field.register("field_matrix", Blockly.FieldMatrix);
