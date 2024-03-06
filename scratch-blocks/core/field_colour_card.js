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
'use strict';

goog.provide('Blockly.FieldColourCard');

goog.require('Blockly.Field');
goog.require('Blockly.DropDownDiv');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');
goog.require('goog.color');
goog.require('goog.ui.Slider');

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
    Blockly.FieldColourCard.superClass_.constructor.call(this, colour, opt_validator);
    this.addArgType('colour');

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
    return new Blockly.FieldColourCard(options['colour']);
};

/**
 * Function to be called if eyedropper can be activated.
 * If defined, an eyedropper button will be added to the color picker.
 * The button calls this function with a callback to update the field value.
 * BEWARE: This is not a stable API, so it is being marked as private. It may change.
 * @private
 */
Blockly.FieldColourCard.activateEyedropper_ = null;
Blockly.FieldColourCard.colorList = ["#e700a7", "#c061f1", "#0090f5", "#77e8ff", "#00cb54", "#00a845", "#ffe360", "#fcac00", "#ff000c", "#fff", "#571cc1", "#000"];
Blockly.FieldColourCard.prototype.selectColor = Blockly.FieldColourCard.colorList[0];
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
    if (this.sourceBlock_ && Blockly.Events.isEnabled() &&
        this.colour_ != colour) {
        Blockly.Events.fire(new Blockly.Events.BlockChange(
            this.sourceBlock_, 'field', this.name, this.colour_, colour));
    }
    this.colour_ = colour;
    if (this.sourceBlock_) {
        // Set the primary, secondary and tertiary colour to this value.
        // The renderer expects to be able to use the secondary colour as the fill for a shadow.
        this.sourceBlock_.setColour(colour, colour, this.sourceBlock_.getColourTertiary());
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
        colour = '#' + m[1] + m[2] + m[3];
    }
    return colour;
};


/**
 * 创建一个色卡
 * @returns 
 */
Blockly.FieldColourCard.prototype.createCardDom_ = function (dropdown) {
    let div = document.createElement('div');
    let selector = document.createElement('div');
    selector.setAttribute('class', 'lls-color-selector-vertical');
    div.appendChild(selector);
    let cards = document.createElement('div');
    cards.setAttribute('class', 'lls-color-slider');
    cards.setAttribute('style', 'width: 40px;height: 100%;');
    selector.appendChild(cards);
    const colorList = Blockly.FieldColourCard.colorList;
    for (let i = 0; i < colorList.length; i++) {
        let divOption = document.createElement('div');
        divOption.setAttribute('class', `lls-color-slider__option ${i === 0 ? 'lls-color-slider__option--first' : i === colorList.length - 1 ? 'lls-color-slider__option--last' : ''}`);
        divOption.setAttribute('style', `background-color: ${colorList[i]}`);
        divOption.setAttribute('data-testid', `slider-color-${colorList[i]}`);
        cards.appendChild(divOption);
    }
    const cardHandler = this.createCardHandler();
    cards.appendChild(cardHandler);

    const children = cards.childNodes;
    const setHandlerTop = (element) => {
        this.selectColorTop = element.offsetTop;
        this.selectColor = element.style.backgroundColor;
        this.cardHandler.style['background-color'] = this.selectColor;
        this.cardHandler.style['top'] = `calc(${this.selectColorTop}px - 2px)`;
        this.setValue(this.rgbToHex(this.selectColor));
    }

    cards.onmousedown = (e) => {
        if (e.target && !div.contains(e.target) && e.target.classList.contains('lls-color-slider__option')) return;
        setHandlerTop(e.target);
    }

    this.cardHandler.onmousedown = () => {
        document.onmousemove = (event) => {
            let top = Math.floor(event.clientY - parseInt(dropdown.parentNode.style.top) - 45);
            for (let i = 0; i < children.length; i++) {
                const ele = children[i];
                if ((top - ele.offsetTop > 0 && top > ele.offsetTop && top < ele.offsetTop + Math.floor(ele.clientHeight / 2)) && ele.classList.contains('lls-color-slider__option')) {
                    top = ele.offsetTop;
                    this.selectColor = ele.style.backgroundColor;
                }
            }
            if (top < 0) {
                top = 0;
            } else if (top > 160) {
                top = 160;
            }
            this.selectColorTop = top;
            this.cardHandler.style['background-color'] = this.selectColor;
            this.cardHandler.style['top'] = `calc(${this.selectColorTop}px - 2px)`;
            this.setValue(this.rgbToHex(this.selectColor));
        }
    }

    document.onmouseup = () => {
        document.onmousemove = null;
    }

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
}

/**
 * 创建选择色卡的选择框
 * @returns 
 */
Blockly.FieldColourCard.prototype.createCardHandler = function () {
    let div = document.createElement('div');
    div.setAttribute('class', 'lls-color-slider__handle lls-color-slider__handle--not-pressed');
    div.setAttribute('style', `background-color: ${this.selectColor}; top: calc(${this.selectColorTop}px - 2px); height: calc(9.09091% + 4px); width: calc(100% + 10px); left: -5px;`);
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

    Blockly.DropDownDiv.setColour(this.sourceBlock_.getColourTertiary(), this.sourceBlock_.getColourTertiary());
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

Blockly.Field.register('field_colour_card', Blockly.FieldColourCard);
