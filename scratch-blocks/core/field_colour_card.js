/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Colour input field.
 * @author
 */
"use strict";

goog.provide("Blockly.FieldColourCard");

goog.require("Blockly.Field");
goog.require("Blockly.DropDownDiv");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.style");
goog.require("goog.color");
goog.require("goog.ui.Slider");

/**
 * Class for a slider-based colour input field.
 * @param {string} colour The initial colour in '#rrggbb' format.
 * @param {Function=} opt_validator A function that is executed when a new
 *     colour is selected.  Its sole argument is the new colour value.  Its
 *     return value becomes the selected colour, unless it is undefined, in
 *     which case the new colour stands, or it is null, in which case the change
 *     is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldColourCard = function (colour, opt_validator) {
  Blockly.FieldColourCard.superClass_.constructor.call(
    this,
    colour,
    opt_validator
  );
  this.addArgType("colour");

  // Flag to track whether or not the slider callbacks should execute
  this.sliderCallbacksEnabled_ = false;
};
goog.inherits(Blockly.FieldColourCard, Blockly.Field);

/**
 * Construct a FieldColourCard from a JSON arg object.
 * @param {!Object} options A JSON object with options (colour).
 * @returns {!Blockly.FieldColourCard} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldColourCard.fromJson = function (options) {
  return new Blockly.FieldColourCard(options["colour"]);
};

/**
 * Function to be called if eyedropper can be activated.
 * If defined, an eyedropper button will be added to the color picker.
 * The button calls this function with a callback to update the field value.
 * BEWARE: This is not a stable API, so it is being marked as private. It may change.
 * @private
 */
Blockly.FieldColourCard.activateEyedropper_ = null;
Blockly.FieldColourCard.colorList = [
  "#8b4513",
  "#ff3030",
  "#ff9300",
  "#fffb0d",
  "#00f91a",
  "#E1FFFF",
  "#0532ff",
  "#9370DB",
  "#686868",
  "#ffffff",
  "#000000",
];
Blockly.FieldColourCard.prototype.selectColor =
  Blockly.FieldColourCard.colorList[0];
Blockly.FieldColourCard.prototype.selectColorTop = 0;

/**
 * Install this field on a block.
 * @param {!Blockly.Block} block The block containing this field.
 */
Blockly.FieldColourCard.prototype.init = function (block) {
  if (this.fieldGroup_) {
    // Colour slider has already been initialized once.
    return;
  }
  Blockly.FieldColourCard.superClass_.init.call(this, block);
  this.setValue(Blockly.FieldColourCard.colorList[0]);
};

/**
 * Return the current colour.
 * @return {string} Current colour in '#rrggbb' format.
 */
Blockly.FieldColourCard.prototype.getValue = function () {
  return this.colour_;
};

/**
 * Set the colour.
 * @param {string} colour The new colour in '#rrggbb' format.
 */
Blockly.FieldColourCard.prototype.setValue = function (colour) {
  if (
    this.sourceBlock_ &&
    Blockly.Events.isEnabled() &&
    this.colour_ != colour
  ) {
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(
        this.sourceBlock_,
        "field",
        this.name,
        this.colour_,
        colour
      )
    );
  }
  this.colour_ = colour;
  if (this.sourceBlock_) {
    // Set the primary, secondary and tertiary colour to this value.
    // The renderer expects to be able to use the secondary colour as the fill for a shadow.
    this.sourceBlock_.setColour(
      colour,
      colour,
      this.sourceBlock_.getColourTertiary()
    );
  }
};

/**
 * Get the text from this field.  Used when the block is collapsed.
 * @return {string} Current text.
 */
Blockly.FieldColourCard.prototype.getText = function () {
  var colour = this.colour_;
  // Try to use #rgb format if possible, rather than #rrggbb.
  var m = colour.match(/^#(.)\1(.)\2(.)\3$/);
  if (m) {
    colour = "#" + m[1] + m[2] + m[3];
  }
  return colour;
};

/**
 * 根据颜色值获取在颜色列表中的索引
 * @param {string} color 颜色值（支持 #rrggbb 或 rgb() 格式）
 * @param {Array<string>} colorList 颜色列表
 * @return {number} 颜色索引，如果未找到则返回 0
 * @private
 */
Blockly.FieldColourCard.prototype.getColorIndex_ = function (color, colorList) {
  // 参数验证
  if (!color || !colorList || colorList.length === 0) {
    return 0;
  }

  // 将颜色值转换为标准格式进行比较
  const normalizeColor = (c) => {
    if (!c) return "";
    // 如果是 rgb() 格式，先转换为 hex
    if (c.startsWith("rgb")) {
      return this.rgbToHex(c) || "";
    }
    // 移除可能的引号和空格，转换为小写
    return c.replace(/['"]/g, "").trim().toLowerCase();
  };

  const targetColor = normalizeColor(color);
  if (!targetColor) {
    return 0;
  }

  // 遍历颜色列表查找匹配项
  for (let i = 0; i < colorList.length; i++) {
    const listColor = normalizeColor(colorList[i]);
    if (listColor === targetColor) {
      return i;
    }
  }

  // 未找到匹配项，返回第一个颜色的索引
  return 0;
};

/**
 * 创建一个色卡
 * @param {Element} dropdown 下拉容器元素
 * @returns {Element} 创建的颜色选择器DOM元素
 */
Blockly.FieldColourCard.prototype.createCardDom_ = function (dropdown) {
  const colorList = Blockly.FieldColourCard.colorList;
  const ITEM_HEIGHT = 21.38;
  const COLOR_COUNT = colorList.length;
  const TOTAL_HEIGHT = ITEM_HEIGHT * COLOR_COUNT;
  const MAX_TOP = (COLOR_COUNT - 1) * ITEM_HEIGHT;

  //创建容器
  let div = document.createElement("div");
  //选择器容器 - 移除固定高度，让内容自适应，不显示滚动条
  let selector = document.createElement("div");
  selector.setAttribute("class", "lls-color-selector-vertical");
  selector.setAttribute("style", "height: auto; overflow: visible;");
  div.appendChild(selector);
  //颜色条
  let cards = document.createElement("div");
  cards.setAttribute("class", "lls-color-slider");
  cards.setAttribute("style", `width: 40px;height:${TOTAL_HEIGHT}px;`);
  selector.appendChild(cards);

  // 创建颜色选项
  for (let i = 0; i < COLOR_COUNT; i++) {
    let divOption = document.createElement("div");
    divOption.setAttribute(
      "class",
      `lls-color-slider__option ${
        i === 0
          ? "lls-color-slider__option--first"
          : i === COLOR_COUNT - 1
          ? "lls-color-slider__option--last"
          : ""
      }`
    );
    divOption.setAttribute("style", `background-color: ${colorList[i]}`);
    divOption.setAttribute("data-testid", `slider-color-${colorList[i]}`);
    cards.appendChild(divOption);
  }

  // 创建并添加选择器手柄
  const cardHandler = this.createCardHandler();
  cards.appendChild(cardHandler);

  // 获取当前颜色对应的索引
  const currentColor = this.getValue() || colorList[0];
  const currentColorIndex = this.getColorIndex_(currentColor, colorList);
  const initialTop = currentColorIndex * ITEM_HEIGHT;
  this.selectColorTop = initialTop;
  this.selectColor = colorList[currentColorIndex];

  // 初始化手柄位置
  this.cardHandler.style["background-color"] = this.selectColor;
  this.cardHandler.style["top"] = `calc(${this.selectColorTop}px - 2px)`;

  // 收集所有颜色选项元素
  const children = cards.childNodes;
  let childList = [];
  for (let i = 0; i < children.length; i++) {
    const element = children[i];
    if (element.classList.contains("lls-color-slider__option")) {
      childList.push(element);
    }
  }

  // 设置手柄位置的辅助函数
  const setHandlerTop = (element) => {
    if (!element || !element.classList.contains("lls-color-slider__option")) {
      return;
    }
    this.selectColorTop = element.offsetTop;
    this.selectColor = element.style.backgroundColor;
    this.cardHandler.style["background-color"] = this.selectColor;
    this.cardHandler.style["top"] = `calc(${this.selectColorTop}px - 2px)`;
    this.setValue(this.rgbToHex(this.selectColor));
  };

  // 点击颜色条直接选择颜色
  cards.onmousedown = (e) => {
    if (e.target && e.target.classList.contains("lls-color-slider__option")) {
      setHandlerTop(e.target);
    }
  };

  // 拖动手柄选择颜色
  this.cardHandler.onmousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const mouseMoveHandler = (event) => {
      if (!dropdown || !dropdown.parentNode) return;

      let top = Math.floor(
        event.clientY - parseInt(dropdown.parentNode.style.top) - 45
      );
      let num = Math.round(top / ITEM_HEIGHT);

      // 限制在有效范围内
      if (num < 0) {
        num = 0;
      } else if (num > childList.length - 1) {
        num = childList.length - 1;
      }

      const colorElement = childList[num];
      if (colorElement) {
        const color = colorElement.style.backgroundColor;
        this.selectColorTop = num * ITEM_HEIGHT;

        // 确保不超过最大范围
        if (this.selectColorTop < 0) {
          this.selectColorTop = 0;
        } else if (this.selectColorTop > MAX_TOP) {
          this.selectColorTop = MAX_TOP;
        }

        if (color) {
          this.selectColor = color;
          this.cardHandler.style["background-color"] = this.selectColor;
          this.cardHandler.style[
            "top"
          ] = `calc(${this.selectColorTop}px - 2px)`;
          this.setValue(this.rgbToHex(this.selectColor));
        }
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  return div;
};

Blockly.FieldColourCard.prototype.rgbToHex = function (rgb) {
  if (!rgb) {
    return;
  }
  // 提取R、G、B分量
  var values = rgb.match(/\d+/g);

  var r = parseInt(values[0]);
  var g = parseInt(values[1]);
  var b = parseInt(values[2]);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return;
  }
  // 将每个分量转换为2位十六进制数
  var hexR = r.toString(16).padStart(2, "0");
  var hexG = g.toString(16).padStart(2, "0");
  var hexB = b.toString(16).padStart(2, "0");

  // 返回hex格式
  return "#" + hexR + hexG + hexB;
};

/**
 * 创建选择色卡的选择框
 * @returns
 */
Blockly.FieldColourCard.prototype.createCardHandler = function () {
  let div = document.createElement("div");
  div.setAttribute(
    "class",
    "lls-color-slider__handle lls-color-slider__handle--not-pressed"
  );
  div.setAttribute(
    "style",
    `background-color: ${this.selectColor}; top: calc(${this.selectColorTop}px - 2px); height: calc(12.09091% + 4px); width: calc(100% + 10px); left: -5px;`
  );
  this.cardHandler = div;
  return div;
};

/**
 * Create card under the colour field.
 * @private
 */
Blockly.FieldColourCard.prototype.showEditor_ = function () {
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var div = Blockly.DropDownDiv.getContentDiv();

  const cardEle = this.createCardDom_(div);
  div.appendChild(cardEle);

  Blockly.DropDownDiv.setColour(
    this.sourceBlock_.getColourTertiary(),
    this.sourceBlock_.getColourTertiary()
  );
  Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  // Set value updates the slider positions
  // Do this before attaching callbacks to avoid extra events from initial set
  this.setValue(this.getValue());

  // Enable callbacks for the sliders
  this.sliderCallbacksEnabled_ = true;
};

Blockly.FieldColourCard.prototype.dispose = function () {
  Blockly.Events.setGroup(false);
  Blockly.FieldColourCard.superClass_.dispose.call(this);
};

Blockly.Field.register("field_colour_card", Blockly.FieldColourCard);
