/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2018 Massachusetts Institute of Technology
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
 * @fileoverview Note input field, for selecting a musical note on a piano.
 * @author ericr@media.mit.edu (Eric Rosenbaum)
 */
"use strict";

goog.provide("Blockly.FieldPiano");

goog.require("Blockly.DropDownDiv");
goog.require("Blockly.FieldTextInput");
goog.require("goog.math");
goog.require("goog.userAgent");

/**
 * Class for a note input field, for selecting a musical note on a piano.
 * @param {(string|number)=} opt_value The initial content of the field. The
 *     value should cast to a number, and if it does not, '0' will be used.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.FieldTextInput}
 * @constructor
 */
Blockly.FieldPiano = function (opt_value, opt_validator) {
  opt_value = Blockly.FieldPiano.normalizeInitialValue_(opt_value);
  Blockly.FieldPiano.superClass_.constructor.call(
    this,
    opt_value,
    opt_validator
  );
  this.addArgType("note");

  /**
   * Width of the field. Computed when drawing it, and used for animation.
   * @type {number}
   * @private
   */
  this.fieldEditorWidth_ = 0;

  /**
   * Height of the field. Computed when drawing it.
   * @type {number}
   * @private
   */
  this.fieldEditorHeight_ = 0;

  /**
   * The piano SVG.
   * @type {SVGElement}
   * @private
   */
  this.pianoSVG_ = null;

  /**
   * Array of SVG elements representing the clickable piano keys.
   * @type {!Array<SVGElement>}
   * @private
   */
  this.keySVGs_ = [];

  /**
   * Note name indicator at the top of the field.
   * @type {SVGElement}
   * @private
   */
  this.noteNameText_ = null;

  /**
   * Note name indicator on the low C key.
   * @type {SVGElement}
   * @private
   */
  this.lowCText_ = null;

  /**
   * Note name indicator on the low C key.
   * @type {SVGElement}
   * @private
   */
  this.highCText_ = null;

  /**
   * 当前弹层内显示的页码：0 = C5–B5，1 = C6–C7。
   * @type {?number}
   * @private
   */
  this.displayedPage_ = null;

  /**
   * 白键 / 黑键图层，换页时清空并重绘。
   * @type {SVGElement}
   * @private
   */
  this.whiteKeyGroup_ = null;

  /**
   * @type {SVGElement}
   * @private
   */
  this.blackKeyGroup_ = null;

  /**
   * 弹层根 svg、装饰线与阴影，用于随页宽变化更新布局。
   * @type {SVGElement}
   * @private
   */
  this.fieldPianoSvg_ = null;

  /**
   * @type {SVGElement}
   * @private
   */
  this.keysTopLine_ = null;

  /**
   * @type {SVGElement}
   * @private
   */
  this.keysShadowRect_ = null;

  /**
   * 右侧翻页按钮创建时传入的 x，配合 translate 保持与弹层右缘对齐。
   * @type {?number}
   * @private
   */
  this.octaveUpAnchorX_ = null;

  /**
   * A flag indicating that the mouse is currently down. Used in combination with
   * mouse enter events to update the key selection while dragging.
   * @type {boolean}
   * @private
   */
  this.mouseIsDown_ = false;

  /**
   * An array of wrappers for mouse down events on piano keys.
   * @type {!Array.<!Array>}
   * @private
   */
  this.mouseDownWrappers_ = [];

  /**
   * A wrapper for the mouse up event.
   * @type {!Array.<!Array>}
   * @private
   */
  this.mouseUpWrapper_ = null;

  /**
   * An array of wrappers for mouse enter events on piano keys.
   * @type {!Array.<!Array>}
   * @private
   */
  this.mouseEnterWrappers_ = [];

  /**
   * A wrapper for the mouse down event on the octave down button.
   * @type {!Array.<!Array>}
   * @private
   */
  this.octaveDownMouseDownWrapper_ = null;

  /**
   * A wrapper for the mouse down event on the octave up button.
   * @type {!Array.<!Array>}
   * @private
   */
  this.octaveUpMouseDownWrapper_ = null;

  this.noteNum_ = 0;
  this.noteName_ = null;
};
goog.inherits(Blockly.FieldPiano, Blockly.FieldTextInput);

/**
 * Inset in pixels of content displayed in the field, caused by parent properties.
 * The inset is actually determined by the CSS property blocklyDropDownDiv- it is
 * the sum of the padding and border thickness.
 */
Blockly.FieldPiano.INSET = 5;

/**
 * Height of the top area of the field, in px.
 * @type {number}
 * @const
 */
Blockly.FieldPiano.TOP_MENU_HEIGHT = 32 - Blockly.FieldPiano.INSET;

/**
 * Padding on the top and sides of the field, in px.
 * @type {number}
 * @const
 */
Blockly.FieldPiano.EDGE_PADDING = 1;

/**
 * Height of the drop shadow on the piano, in px.
 * @type {number}
 * @const
 */
Blockly.FieldPiano.SHADOW_HEIGHT = 4;

/**
 * Color for the shadow on the piano.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.SHADOW_COLOR = "#000";

/**
 * Opacity for the shadow on the piano.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.SHADOW_OPACITY = 0.2;

/**
 * A color for the white piano keys.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.WHITE_KEY_COLOR = "#FFFFFF";

/**
 * A color for the black piano keys.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.BLACK_KEY_COLOR = "#323133";

/**
 * A color for stroke around black piano keys.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.BLACK_KEY_STROKE = "#555555";

/**
 * A color for the selected state of a piano key.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.KEY_SELECTED_COLOR = "#b0d6ff";

/**
 * 分页中白键数量的最大值（第二页 C6–C7 为 8），仅供对照。
 * @type {number}
 * @const
 */
Blockly.FieldPiano.NUM_WHITE_KEYS_MAX = 8;

/**
 * Height of a white piano key, in px.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.WHITE_KEY_HEIGHT = 72;

/**
 * Width of a white piano key, in px.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.WHITE_KEY_WIDTH = 40;

/**
 * Height of a black piano key, in px.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.BLACK_KEY_HEIGHT = 40;

/**
 * Width of a black piano key, in px.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.BLACK_KEY_WIDTH = 32;

/**
 * Radius of the curved bottom corner of a piano key, in px.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.KEY_RADIUS = 6;

/**
 * Bottom padding for the labels on C keys.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.KEY_LABEL_PADDING = 8;

/**
 * 一条键盘上的键序（从左到右绘制）。共两组：第一组 C5–B5（pitch 0–11），第二组 C6–C7（pitch 12–24）。
 * pitch 与琴键下标一致，亦作为内部 note 序号 0..MAX_NOTE。
 * @type {Array.<{name: String, pitch: number, isBlack?: boolean}>}
 * @const
 */
Blockly.FieldPiano.KEY_INFO = [
  { name: "C5", pitch: 0 },
  { name: "C#5", pitch: 1, isBlack: true },
  { name: "D5", pitch: 2 },
  { name: "D#5", pitch: 3, isBlack: true },
  { name: "E5", pitch: 4 },
  { name: "F5", pitch: 5 },
  { name: "F#5", pitch: 6, isBlack: true },
  { name: "G5", pitch: 7 },
  { name: "G#5", pitch: 8, isBlack: true },
  { name: "A5", pitch: 9 },
  { name: "A#5", pitch: 10, isBlack: true },
  { name: "B5", pitch: 11 },
  { name: "C6", pitch: 12 },
  { name: "C#6", pitch: 13, isBlack: true },
  { name: "D6", pitch: 14 },
  { name: "D#6", pitch: 15, isBlack: true },
  { name: "E6", pitch: 16 },
  { name: "F6", pitch: 17 },
  { name: "F#6", pitch: 18, isBlack: true },
  { name: "G6", pitch: 19 },
  { name: "G#6", pitch: 20, isBlack: true },
  { name: "A6", pitch: 21 },
  { name: "A#6", pitch: 22, isBlack: true },
  { name: "B6", pitch: 23 },
  { name: "C7", pitch: 24 },
];

/**
 * The MIDI note number of the highest note selectable on the piano.
 * @type {number}
 * @const
 */
Blockly.FieldPiano.MAX_NOTE = 24;
// 最大内部音键序号（与 KEY_INFO 最后一个 pitch 一致）。本条键盘固定显示 C5–C7，不再整段平移换组。

/**
 * 将用户输入或存储值解析为 0..MAX_NOTE 的 pitch；无法识别时返回 null。
 * 接受纯数字序号或 KEY_INFO 中的音名（大小写不敏感）；单独 "C" 视为 C5。
 * @param {*} raw 文本或数字
 * @return {?number}
 * @package
 */
Blockly.FieldPiano.tryPitchFromText_ = function (raw) {
  if (raw === null || raw === undefined) {
    return null;
  }
  var s = String(raw).trim();
  if (s === "") {
    return null;
  }
  if (/^-?\d+$/.test(s)) {
    var n = parseInt(s, 10);
    if (n < 0 || n > Blockly.FieldPiano.MAX_NOTE) {
      return null;
    }
    return n;
  }
  var upper = s.toUpperCase();
  for (var i = 0; i < Blockly.FieldPiano.KEY_INFO.length; i++) {
    if (Blockly.FieldPiano.KEY_INFO[i].name.toUpperCase() === upper) {
      return Blockly.FieldPiano.KEY_INFO[i].pitch;
    }
  }
  if (upper === "C") {
    return 0;
  }
  return null;
};

/**
 * 积木或 JSON 的初值规范化 KEY_INFO 中存在的音名字符串。
 * @param {*} opt_value
 * @return {string}
 * @package
 */
Blockly.FieldPiano.normalizeInitialValue_ = function (opt_value) {
  var p = Blockly.FieldPiano.tryPitchFromText_(opt_value);
  if (p === null) {
    p = 0;
  }
  return Blockly.FieldPiano.KEY_INFO[p].name;
};

/** 钢琴弹层分页数量。 @type {number} @const */
Blockly.FieldPiano.PIANO_NUM_PAGES = 2;

/**
 * 每页在 KEY_INFO 中的切片 [start, end)。
 * @type {!Array<!Array<number>>}
 * @const
 */
Blockly.FieldPiano.PIANO_PAGE_RANGES = [
  [0, 12],
  [12, 25],
];

/**
 * @param {number} pitch 0..MAX_NOTE
 * @return {number} 页码 0..PIANO_NUM_PAGES-1
 */
Blockly.FieldPiano.pageForPitch_ = function (pitch) {
  if (pitch < Blockly.FieldPiano.PIANO_PAGE_RANGES[0][1]) {
    return 0;
  }
  return 1;
};

/**
 * @param {number} page
 * @return {!Array<!Object>}
 */
Blockly.FieldPiano.keysForPage_ = function (page) {
  var r = Blockly.FieldPiano.PIANO_PAGE_RANGES[page];
  return Blockly.FieldPiano.KEY_INFO.slice(r[0], r[1]);
};

/**
 * @param {!Array<!Object>} keys
 * @return {number}
 */
Blockly.FieldPiano.countWhiteKeys_ = function (keys) {
  var n = 0;
  for (var k = 0; k < keys.length; k++) {
    if (!keys[k].isBlack) {
      n++;
    }
  }
  return n;
};

/**
 * Path to the arrow svg icon, used on the octave buttons.
 * @type {string}
 * @const
 */
Blockly.FieldPiano.ARROW_SVG_PATH = "icons/arrow_button.svg";

/**
 * The size of the square octave buttons.
 * @type {number}
 * @const
 */
Blockly.FieldPiano.OCTAVE_BUTTON_SIZE = 32;

/**
 * Construct a FieldPiano from a JSON arg object.
 * @param {!Object} options A JSON object with options.
 * @returns {!Blockly.FieldPiano} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldPiano.fromJson = function (options) {
  return new Blockly.FieldPiano(options["note"]);
};

/**
 * Clean up this FieldPiano, as well as the inherited FieldTextInput.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldPiano.prototype.dispose_ = function () {
  var thisField = this;
  return function () {
    Blockly.FieldPiano.superClass_.dispose_.call(thisField)();
    thisField.mouseDownWrappers_.forEach(function (wrapper) {
      Blockly.unbindEvent_(wrapper);
    });
    thisField.mouseEnterWrappers_.forEach(function (wrapper) {
      Blockly.unbindEvent_(wrapper);
    });
    if (thisField.mouseUpWrapper_) {
      Blockly.unbindEvent_(thisField.mouseUpWrapper_);
    }
    if (thisField.octaveDownMouseDownWrapper_) {
      Blockly.unbindEvent_(thisField.octaveDownMouseDownWrapper_);
    }
    if (thisField.octaveUpMouseDownWrapper_) {
      Blockly.unbindEvent_(thisField.octaveUpMouseDownWrapper_);
    }
    this.pianoSVG_ = null;
    this.keySVGs_.length = 0;
    this.whiteKeyGroup_ = null;
    this.blackKeyGroup_ = null;
    this.fieldPianoSvg_ = null;
    this.keysTopLine_ = null;
    this.keysShadowRect_ = null;
    this.octaveUpAnchorX_ = null;
    this.noteNameText_ = null;
    this.lowCText_ = null;
    this.highCText_ = null;
  };
};

/**
 * Show a field with piano keys.
 * @private
 */
Blockly.FieldPiano.prototype.showEditor_ = function () {
  // Mobile browsers have issues with in-line textareas (focus & keyboards).
  Blockly.FieldPiano.superClass_.showEditor_.call(
    this,
    this.useTouchInteraction_
  );

  // If there is an existing drop-down someone else owns, hide it immediately and clear it.
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();

  // Build the SVG DOM。
  var div = Blockly.DropDownDiv.getContentDiv();

  var initPitch = Blockly.FieldPiano.tryPitchFromText_(this.getValue());
  if (initPitch === null) {
    initPitch = 0;
  }
  this.displayedPage_ = Blockly.FieldPiano.pageForPitch_(initPitch);

  this.fieldEditorWidth_ = this.computeFieldEditorWidthForPage_(
    this.displayedPage_
  );
  this.fieldEditorHeight_ =
    Blockly.FieldPiano.TOP_MENU_HEIGHT +
    Blockly.FieldPiano.WHITE_KEY_HEIGHT +
    Blockly.FieldPiano.EDGE_PADDING;

  var svg = Blockly.utils.createSvgElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:html": "http://www.w3.org/1999/xhtml",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      version: "1.1",
      height: this.fieldEditorHeight_ + "px",
      width: this.fieldEditorWidth_ + "px",
    },
    div
  );
  this.fieldPianoSvg_ = svg;

  // 白键在下、黑键在上，分两图层。仅绘制当前页（C5–B5 或 C6–C7）。
  this.pianoSVG_ = Blockly.utils.createSvgElement("g", {}, svg);
  this.pianoSVG_.setAttribute("transform", "translate(0, 0)");
  this.whiteKeyGroup_ = Blockly.utils.createSvgElement("g", {}, this.pianoSVG_);
  this.blackKeyGroup_ = Blockly.utils.createSvgElement("g", {}, this.pianoSVG_);

  this.mouseDownWrappers_.length = 0;
  this.mouseEnterWrappers_.length = 0;
  this.keySVGs_ = [];
  this.addPianoPageKeys_(
    0,
    this.whiteKeyGroup_,
    this.blackKeyGroup_,
    this.keySVGs_,
    Blockly.FieldPiano.keysForPage_(this.displayedPage_)
  );

  // Note name indicator at the top of the field
  this.noteNameText_ = Blockly.utils.createSvgElement(
    "text",
    {
      x: this.fieldEditorWidth_ / 2,
      y: Blockly.FieldPiano.TOP_MENU_HEIGHT / 2,
      class: "blocklyText",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
    },
    svg
  );

  // 两端音名标签（x 由 updatePageLabelPositions_ 按当前页白键数量设定）
  var labelSeedX = Blockly.FieldPiano.WHITE_KEY_WIDTH / 2;
  this.lowCText_ = this.addCKeyLabel_(labelSeedX, svg);
  this.highCText_ = this.addCKeyLabel_(labelSeedX, svg);
  this.updatePageLabelPositions_();

  // Horizontal line at the top of the keys
  this.keysTopLine_ = Blockly.utils.createSvgElement(
    "line",
    {
      stroke: this.sourceBlock_.getColourTertiary(),
      x1: 0,
      y1: Blockly.FieldPiano.TOP_MENU_HEIGHT,
      x2: this.fieldEditorWidth_,
      y2: Blockly.FieldPiano.TOP_MENU_HEIGHT,
    },
    svg
  );

  // Drop shadow at the top of the keys
  this.keysShadowRect_ = Blockly.utils.createSvgElement(
    "rect",
    {
      x: 0,
      y: Blockly.FieldPiano.TOP_MENU_HEIGHT,
      width: this.fieldEditorWidth_,
      height: Blockly.FieldPiano.SHADOW_HEIGHT,
      fill: Blockly.FieldPiano.SHADOW_COLOR,
      "fill-opacity": Blockly.FieldPiano.SHADOW_OPACITY,
    },
    svg
  );

  // Octave buttons
  this.octaveDownButton = this.addOctaveButton_(0, true, svg);
  this.octaveUpAnchorX_ =
    this.fieldEditorWidth_ +
    Blockly.FieldPiano.INSET * 2 -
    Blockly.FieldPiano.OCTAVE_BUTTON_SIZE;
  this.octaveUpButton = this.addOctaveButton_(
    this.octaveUpAnchorX_,
    false,
    svg
  );

  this.octaveDownMouseDownWrapper_ = Blockly.bindEvent_(
    this.octaveDownButton,
    "mousedown",
    this,
    function () {
      this.changeOctaveBy_(-1);
    }
  );
  this.octaveUpMouseDownWrapper_ = Blockly.bindEvent_(
    this.octaveUpButton,
    "mousedown",
    this,
    function () {
      this.changeOctaveBy_(1);
    }
  );
  Blockly.DropDownDiv.setColour(
    this.sourceBlock_.parentBlock_.getColour(),
    this.sourceBlock_.getColourTertiary()
  );
  Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  this.updateSelection_();
};

/**
 * 当前页白键数量决定弹层宽度。
 * @param {number} page
 * @return {number}
 * @private
 */
Blockly.FieldPiano.prototype.computeFieldEditorWidthForPage_ = function (page) {
  var pageKeys = Blockly.FieldPiano.keysForPage_(page);
  var nw = Blockly.FieldPiano.countWhiteKeys_(pageKeys);
  return (
    nw * Blockly.FieldPiano.WHITE_KEY_WIDTH + Blockly.FieldPiano.EDGE_PADDING
  );
};

/**
 * 按当前页更新 svg 宽、顶栏与阴影、右侧箭头位置，并重新贴合 DropDown。
 * @private
 */
Blockly.FieldPiano.prototype.applyFieldEditorLayout_ = function () {
  if (this.displayedPage_ == null || !this.fieldPianoSvg_) {
    return;
  }
  this.fieldEditorWidth_ = this.computeFieldEditorWidthForPage_(
    this.displayedPage_
  );
  this.fieldPianoSvg_.setAttribute("width", this.fieldEditorWidth_ + "px");
  if (this.noteNameText_) {
    this.noteNameText_.setAttribute("x", this.fieldEditorWidth_ / 2);
  }
  if (this.keysTopLine_) {
    this.keysTopLine_.setAttribute("x2", this.fieldEditorWidth_);
  }
  if (this.keysShadowRect_) {
    this.keysShadowRect_.setAttribute("width", this.fieldEditorWidth_);
  }
  if (this.octaveUpButton && this.octaveUpAnchorX_ != null) {
    var upX =
      this.fieldEditorWidth_ +
      Blockly.FieldPiano.INSET * 2 -
      Blockly.FieldPiano.OCTAVE_BUTTON_SIZE;
    this.octaveUpButton.setAttribute(
      "transform",
      "translate(" + (upX - this.octaveUpAnchorX_) + ", 0)"
    );
  }
  if (this.sourceBlock_) {
    Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);
  }
};

/**
 * 绘制当前页的一排琴键（KEY_INFO 的一段子集）。
 * @param {number} x 左缘 x。
 * @param {SVGElement} whiteKeyGroup
 * @param {SVGElement} blackKeyGroup
 * @param {!Array.<SVGElement>} keySVGarray 与 pageKeys 等长，可点击键的 SVG。
 * @param {!Array<!Object>} pageKeys 来自 keysForPage_
 * @private
 */
Blockly.FieldPiano.prototype.addPianoPageKeys_ = function (
  x,
  whiteKeyGroup,
  blackKeyGroup,
  keySVGarray,
  pageKeys
) {
  var xIncrement, width, height, fill, stroke, group;
  x += Blockly.FieldPiano.EDGE_PADDING / 2;
  var y = Blockly.FieldPiano.TOP_MENU_HEIGHT;
  for (var i = 0; i < pageKeys.length; i++) {
    if (pageKeys[i].isBlack) {
      x -= Blockly.FieldPiano.BLACK_KEY_WIDTH / 2;
      xIncrement = Blockly.FieldPiano.BLACK_KEY_WIDTH / 2;
      width = Blockly.FieldPiano.BLACK_KEY_WIDTH;
      height = Blockly.FieldPiano.BLACK_KEY_HEIGHT;
      fill = Blockly.FieldPiano.BLACK_KEY_COLOR;
      stroke = Blockly.FieldPiano.BLACK_KEY_STROKE;
      group = blackKeyGroup;
    } else {
      xIncrement = Blockly.FieldPiano.WHITE_KEY_WIDTH;
      width = Blockly.FieldPiano.WHITE_KEY_WIDTH;
      height = Blockly.FieldPiano.WHITE_KEY_HEIGHT;
      fill = Blockly.FieldPiano.WHITE_KEY_COLOR;
      stroke = this.sourceBlock_.getColourTertiary();
      group = whiteKeyGroup;
    }
    var attr = {
      d: this.getPianoKeyPath_(x, y, width, height),
      fill: fill,
      stroke: stroke,
    };
    x += xIncrement;

    var keySVG = Blockly.utils.createSvgElement("path", attr, group);

    keySVGarray[i] = keySVG;
    keySVG.setAttribute("data-pitch", pageKeys[i].pitch);
    keySVG.setAttribute("data-name", pageKeys[i].name);
    keySVG.setAttribute(
      "data-isBlack",
      pageKeys[i].isBlack ? "true" : "false"
    );

    this.mouseDownWrappers_[i] = Blockly.bindEvent_(
      keySVG,
      "mousedown",
      this,
      this.onMouseDownOnKey_
    );
    this.mouseEnterWrappers_[i] = Blockly.bindEvent_(
      keySVG,
      "mouseenter",
      this,
      this.onMouseEnter_
    );
  }
};

/**
 * 换页时清空并重建琴键，并更新左右音名标签位置。
 * @private
 */
Blockly.FieldPiano.prototype.refreshPianoPageKeys_ = function () {
  if (!this.whiteKeyGroup_ || !this.blackKeyGroup_) {
    return;
  }
  var w;
  for (w = 0; w < this.mouseDownWrappers_.length; w++) {
    if (this.mouseDownWrappers_[w]) {
      Blockly.unbindEvent_(this.mouseDownWrappers_[w]);
    }
  }
  for (w = 0; w < this.mouseEnterWrappers_.length; w++) {
    if (this.mouseEnterWrappers_[w]) {
      Blockly.unbindEvent_(this.mouseEnterWrappers_[w]);
    }
  }
  this.mouseDownWrappers_.length = 0;
  this.mouseEnterWrappers_.length = 0;
  while (this.whiteKeyGroup_.firstChild) {
    this.whiteKeyGroup_.removeChild(this.whiteKeyGroup_.firstChild);
  }
  while (this.blackKeyGroup_.firstChild) {
    this.blackKeyGroup_.removeChild(this.blackKeyGroup_.firstChild);
  }
  this.keySVGs_.length = 0;
  var pageKeys = Blockly.FieldPiano.keysForPage_(this.displayedPage_);
  this.addPianoPageKeys_(
    0,
    this.whiteKeyGroup_,
    this.blackKeyGroup_,
    this.keySVGs_,
    pageKeys
  );
  this.updatePageLabelPositions_();
  this.applyFieldEditorLayout_();
};

/**
 * 当前页两端音名标签的 x 与文案（该页最低音、最高音）。
 * @private
 */
Blockly.FieldPiano.prototype.updatePageLabelPositions_ = function () {
  if (!this.lowCText_ || !this.highCText_) {
    return;
  }
  var pageKeys = Blockly.FieldPiano.keysForPage_(this.displayedPage_);
  var nw = Blockly.FieldPiano.countWhiteKeys_(pageKeys);
  var lowCX = Blockly.FieldPiano.WHITE_KEY_WIDTH / 2;
  var highCX =
    lowCX +
    Blockly.FieldPiano.WHITE_KEY_WIDTH * Math.max(0, nw - 1);
  this.lowCText_.setAttribute("x", lowCX);
  this.highCText_.setAttribute("x", highCX);
  if (pageKeys.length) {
    this.lowCText_.textContent = pageKeys[0].name;
    this.highCText_.textContent = pageKeys[pageKeys.length - 1].name;
  }
};

/**
 * Construct the SVG path string for a piano key shape: a rectangle with rounded
 * corners at the bottom.
 * @param {number} x the x position for the key.
 * @param {number} y the y position for the key.
 * @param {number} width the width of the key.
 * @param {number} height the height of the key.
 * @returns {string} the SVG path as a string.
 * @private
 */
Blockly.FieldPiano.prototype.getPianoKeyPath_ = function (x, y, width, height) {
  return (
    "M" +
    x +
    " " +
    y +
    " " +
    "L" +
    x +
    " " +
    (y + height - Blockly.FieldPiano.KEY_RADIUS) +
    " " +
    "Q" +
    x +
    " " +
    (y + height) +
    " " +
    (x + Blockly.FieldPiano.KEY_RADIUS) +
    " " +
    (y + height) +
    " " +
    "L" +
    (x + width - Blockly.FieldPiano.KEY_RADIUS) +
    " " +
    (y + height) +
    " " +
    "Q" +
    (x + width) +
    " " +
    (y + height) +
    " " +
    (x + width) +
    " " +
    (y + height - Blockly.FieldPiano.KEY_RADIUS) +
    " " +
    "L" +
    (x + width) +
    " " +
    y +
    " " +
    "L" +
    x +
    " " +
    y
  );
};

/**
 * Add a button for switching the displayed octave of the piano up or down.
 * @param {number} x The x position of the button.
 * @param {boolean} flipped If true, the icon should be flipped.
 * @param {SvgElement} svg The svg element to add the buttons to.
 * @returns {SvgElement} A group containing the button SVG elements.
 * @private
 */
Blockly.FieldPiano.prototype.addOctaveButton_ = function (x, flipped, svg) {
  var group = Blockly.utils.createSvgElement("g", {}, svg);
  var imageSize = Blockly.FieldPiano.OCTAVE_BUTTON_SIZE;
  var arrow = Blockly.utils.createSvgElement(
    "image",
    {
      width: imageSize,
      height: imageSize,
      x: x - Blockly.FieldPiano.INSET,
      y: -1 * Blockly.FieldPiano.INSET,
    },
    group
  );
  arrow.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    Blockly.mainWorkspace.options.pathToMedia +
      Blockly.FieldPiano.ARROW_SVG_PATH
  );
  Blockly.utils.createSvgElement(
    "line",
    {
      stroke: this.sourceBlock_.getColourTertiary(),
      x1: x - Blockly.FieldPiano.INSET,
      y1: 0,
      x2: x - Blockly.FieldPiano.INSET,
      y2: Blockly.FieldPiano.TOP_MENU_HEIGHT - Blockly.FieldPiano.INSET,
    },
    group
  );
  if (flipped) {
    var translateX =
      -1 * Blockly.FieldPiano.OCTAVE_BUTTON_SIZE + Blockly.FieldPiano.INSET * 2;
    group.setAttribute(
      "transform",
      "scale(-1, 1) " + "translate(" + translateX + ", 0)"
    );
  }
  return group;
};

/**
 * Add an SVG text label for display on the C keys of the piano.
 * @param {number} x The x position for the label.
 * @param {SvgElement} svg The SVG element to add the label to.
 * @returns {SvgElement} The SVG element containing the label.
 * @private
 */
Blockly.FieldPiano.prototype.addCKeyLabel_ = function (x, svg) {
  return Blockly.utils.createSvgElement(
    "text",
    {
      x: x,
      y:
        Blockly.FieldPiano.TOP_MENU_HEIGHT +
        Blockly.FieldPiano.WHITE_KEY_HEIGHT -
        Blockly.FieldPiano.KEY_LABEL_PADDING,
      class: "scratchNotePickerKeyLabel",
      "text-anchor": "middle",
    },
    svg
  );
};

/**
 * Handle the mouse down event on a piano key.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.FieldPiano.prototype.onMouseDownOnKey_ = function (e) {
  this.mouseIsDown_ = true;
  this.mouseUpWrapper_ = Blockly.bindEvent_(
    document.body,
    "mouseup",
    this,
    this.onMouseUp_
  );
  this.selectNoteWithMouseEvent_(e);
};

/**
 * Handle the mouse up event following a mouse down on a piano key.
 * @private
 */
Blockly.FieldPiano.prototype.onMouseUp_ = function () {
  this.mouseIsDown_ = false;
  Blockly.unbindEvent_(this.mouseUpWrapper_);
};

/**
 * Handle the event when the mouse enters a piano key.
 * @param {!Event} e Mouse enter event.
 * @private
 */
Blockly.FieldPiano.prototype.onMouseEnter_ = function (e) {
  if (this.mouseIsDown_) {
    this.selectNoteWithMouseEvent_(e);
  }
};

/**
 * Use the data in a mouse event to select a new note, and play it.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.FieldPiano.prototype.selectNoteWithMouseEvent_ = function (e) {
  // data-pitch 为单条键盘上的序号 0..MAX_NOTE（C5=0 … C7=24），不再按八度平移相加
  var newNoteNum = Number(e.target.getAttribute("data-pitch"));
  var newNote = e.target.getAttribute("data-name");
  this.setNoteNum_(newNoteNum, newNote);
  this.playNoteInternal_();
};

/**
 * Play a note, by calling the externally overriden play note function.
 * @private
 */
Blockly.FieldPiano.prototype.playNoteInternal_ = function () {
  if (Blockly.FieldPiano.playNote_) {
    Blockly.FieldPiano.playNote_(
      this.getValue(),
      this.sourceBlock_.parentBlock_.getCategory()
    );
  }
};

/**
 * Function to play a musical note corresponding to the key selected.
 * Overridden externally.
 * @param {number} noteNum the MIDI note number to play.
 * @param {string} id An id to select a scratch extension to play the note.
 * @private
 */
Blockly.FieldPiano.playNote_ = function (/* noteNum, id*/) {
  return;
};

/**
 * 左右箭头：在 C5–B5 与 C6–C7 两页之间切换。
 * @param {number} delta -1 上一页，+1 下一页
 * @private
 */
Blockly.FieldPiano.prototype.changeOctaveBy_ = function (delta) {
  if (this.displayedPage_ == null) {
    var initP = Blockly.FieldPiano.tryPitchFromText_(this.getValue());
    this.displayedPage_ = Blockly.FieldPiano.pageForPitch_(
      initP !== null ? initP : 0
    );
  }
  var next = this.displayedPage_ + delta;
  if (next < 0 || next >= Blockly.FieldPiano.PIANO_NUM_PAGES) {
    return;
  }
  this.displayedPage_ = next;
  this.refreshPianoPageKeys_();
  this.updateSelection_();
};

/**
 * Set the selected note number, and update the piano display and the input field.
 * @param {number} noteNum The MIDI note number to select.
 * @private
 */
Blockly.FieldPiano.prototype.setNoteNum_ = function (
  noteNum,
  noteText = this.noteName_
) {
  // noteNum = this.callValidator(noteNum);
  this.noteNum_ = noteNum;
  // 显示名即 KEY_INFO 中的 name（如 C5、C#6）

  this.noteName_ = noteText;
  this.setValue(this.noteName_);
  Blockly.FieldTextInput.htmlInput_.value = this.noteName_;
  Blockly.FieldTextInput.htmlInput_.setAttribute("value", this.noteName_);
};

/**
 * Sets the text in this field.  Triggers a rerender of the source block, and
 * updates the selection on the field.
 * @param {?string} text New text.
 */
Blockly.FieldPiano.prototype.setText = function (text) {
  Blockly.FieldPiano.superClass_.setText.call(this, text);
  if (!this.textElement_) {
    // Not rendered yet.
    return;
  }
  this.updateSelection_();
  // Cached width is obsolete.  Clear it.
  this.size_.width = 0;
};

Blockly.FieldPiano.prototype.validate_ = function () {
  return this.noteName_;
};

/**
 * For a MIDI note number, find the index of the corresponding piano key.
 * @param {number} noteNum The note number.
 * @returns {number} The index of the piano key.
 * @private
 */
Blockly.FieldPiano.prototype.noteNumToKeyIndex_ = function (noteNum) {
  var i = Math.floor(Number(noteNum));
  if (i < 0) {
    i = 0;
  }
  if (i > Blockly.FieldPiano.KEY_INFO.length - 1) {
    i = Blockly.FieldPiano.KEY_INFO.length - 1;
  }
  return i;
};

/**
 * Update the selected note and labels on the field.
 * @private
 */
Blockly.FieldPiano.prototype.updateSelection_ = function () {
  var p = Blockly.FieldPiano.tryPitchFromText_(this.getValue());
  if (p === null) {
    p = Blockly.FieldPiano.tryPitchFromText_(this.noteNum_);
  }
  if (p === null) {
    p = 0;
  }
  this.noteNum_ = p;

  if (!this.keySVGs_.length || !this.noteNameText_) {
    return;
  }

  var page =
    this.displayedPage_ != null
      ? this.displayedPage_
      : Blockly.FieldPiano.pageForPitch_(p);
  var pageKeys = Blockly.FieldPiano.keysForPage_(page);
  var localIndex = -1;
  var j;
  for (j = 0; j < pageKeys.length; j++) {
    if (pageKeys[j].pitch === p) {
      localIndex = j;
      break;
    }
  }

  var gIdx = this.noteNumToKeyIndex_(p);
  var noteNameGlobal = Blockly.FieldPiano.KEY_INFO[gIdx].name;

  this.keySVGs_.forEach(function (svg) {
    var isBlack = svg.getAttribute("data-isBlack");
    if (isBlack === "true") {
      svg.setAttribute("fill", Blockly.FieldPiano.BLACK_KEY_COLOR);
    } else {
      svg.setAttribute("fill", Blockly.FieldPiano.WHITE_KEY_COLOR);
    }
  });

  if (localIndex >= 0 && this.keySVGs_[localIndex]) {
    this.keySVGs_[localIndex].setAttribute(
      "fill",
      Blockly.FieldPiano.KEY_SELECTED_COLOR
    );
    this.noteNameText_.textContent =
      pageKeys[localIndex].name + " (" + p + ")";
  } else {
    this.noteNameText_.textContent = noteNameGlobal + " (" + p + ")";
  }

  if (this.lowCText_ && this.highCText_) {
    this.updatePageLabelPositions_();
  }
};

/**
 * 校验输入为 0..MAX_NOTE 的序号或 KEY_INFO 中的音名，保存为规范音名字符串。
 * @param {string} text The user's text.
 * @return {?string} 规范音名，无效则 null。
 */
Blockly.FieldPiano.prototype.classValidator = function (text) {
  if (text === null) {
    return null;
  }
  var p = Blockly.FieldPiano.tryPitchFromText_(text);
  if (p === null) {
    return null;
  }
  return Blockly.FieldPiano.KEY_INFO[p].name;
};

Blockly.Field.register("field_piano", Blockly.FieldPiano);
