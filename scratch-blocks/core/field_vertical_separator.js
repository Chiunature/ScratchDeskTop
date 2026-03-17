/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2017 Massachusetts Institute of Technology
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
 * @fileoverview 竖线分隔符字段。在积木上画一条竖线，用于分隔图标和文字。
 * @author ericr@media.mit.edu (Eric Rosenbaum)
 */
'use strict';

// 声明本模块提供的类，供其他文件引用
goog.provide('Blockly.FieldVerticalSeparator');

// 依赖：积木字段基类、DOM 工具、尺寸工具
goog.require('Blockly.Field');
goog.require('goog.dom');
goog.require('goog.math.Size');


/**
 * 竖线分隔符字段的构造函数。
 * 继承自 Blockly.Field，用于在积木上显示一条竖线。
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldVerticalSeparator = function() {
  this.sourceBlock_ = null;   // 所属的积木块，初始化时为空
  this.width_ = 1;            // 竖线宽度：1 像素
  this.height_ = Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT;  // 竖线高度，使用全局常量
  this.size_ = new goog.math.Size(this.width_, this.height_);  // 字段占用的宽高
};
goog.inherits(Blockly.FieldVerticalSeparator, Blockly.Field);  // 继承自 Blockly.Field

/**
 * 从 JSON 配置创建竖线分隔符（积木定义里写 type: "field_vertical_separator" 时会调用）。
 * @param {!Object} _element 传入的 JSON 配置（当前未使用，但由 Field.fromJson 传入）
 * @returns {!Blockly.FieldVerticalSeparator} 新创建的竖线字段实例
 * @package
 * @nocollapse
 */
Blockly.FieldVerticalSeparator.fromJson = function(
    /* eslint-disable no-unused-vars */ _element
    /* eslint-enable no-unused-vars */) {
  return new Blockly.FieldVerticalSeparator();
};

/** 不可编辑：竖线没有可编辑内容，保存积木到 XML 时不会保存这个字段 */
Blockly.FieldVerticalSeparator.prototype.EDITABLE = false;

/**
 * 把竖线字段“安装”到积木上：创建 SVG 元素并画线。
 * 竖线颜色取自当前积木的次要颜色（getColourSecondary）。
 */
Blockly.FieldVerticalSeparator.prototype.init = function() {
  if (this.fieldGroup_) {
    // 已经初始化过了，避免重复创建
    return;
  }
  // 创建 SVG 容器（g 元素）
  /** @type {SVGElement} */
  this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
  if (!this.visible_) {
    this.fieldGroup_.style.display = 'none';  // 不可见时隐藏
  }
  // 创建竖线：SVG 的 <line>，从 (0,0) 到 (0, height_)
  /** @type {SVGElement} */
  this.lineElement_ = Blockly.utils.createSvgElement('line',
      {
        'stroke': this.sourceBlock_.getColourSecondary(),  // 线条颜色 = 积木的次要色
        'stroke-linecap': 'round',   // 线端圆角
        'x1': 0,
        'y1': 0,
        'x2': 0,
        'y2': this.height_
      }, this.fieldGroup_);

  // 把竖线挂到积木的 SVG 根节点上，这样才会显示出来
  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
};

/**
 * 只改竖线的显示高度（不改字段自身高度）。
 * 用于帽子形积木等需要竖线高度与块不同的情况。
 * @param {number} newHeight 竖线新的高度（y2 坐标）
 * @package
 */
Blockly.FieldVerticalSeparator.prototype.setLineHeight = function(newHeight) {
  this.lineElement_.setAttribute('y2', newHeight);
};

/**
 * 销毁：移除 DOM 节点，释放引用。
 * 积木被删除或工作区清理时会调用。
 */
Blockly.FieldVerticalSeparator.prototype.dispose = function() {
  goog.dom.removeNode(this.fieldGroup_);
  this.fieldGroup_ = null;
  this.lineElement_ = null;
};

/**
 * 获取“值”：竖线没有值，始终返回 null。
 * @return {string} null
 * @override
 */
Blockly.FieldVerticalSeparator.prototype.getValue = function() {
  return null;
};

/**
 * 设置“值”：竖线不可编辑，什么都不做。
 * @param {?string} src 新值（本字段忽略）
 * @override
 */
Blockly.FieldVerticalSeparator.prototype.setValue = function(
    /* eslint-disable no-unused-vars */ src
    /* eslint-enable no-unused-vars */) {
  return;
};

/**
 * 设置文字：竖线没有文字，什么都不做。
 * @param {?string} alt 新文字（本字段忽略）
 * @override
 */
Blockly.FieldVerticalSeparator.prototype.setText = function(
    /* eslint-disable no-unused-vars */ alt
    /* eslint-enable no-unused-vars */) {
  return;
};

/**
 * 内部渲染：竖线宽高固定，不需要根据内容重新渲染。
 * @private
 */
Blockly.FieldVerticalSeparator.prototype.render_ = function() {
  // NOP 空操作
};

/**
 * 更新宽度：竖线宽度固定为 1，不需要更新。
 * @private
 */
Blockly.FieldVerticalSeparator.prototype.updateWidth = function() {
  // NOP 空操作
};

// 把类型名 "field_vertical_separator" 注册到 Blockly，积木 JSON 里写 type 时就能用
Blockly.Field.register(
    'field_vertical_separator', Blockly.FieldVerticalSeparator);
