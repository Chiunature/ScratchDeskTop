'use strict';

goog.provide('Blockly.FieldCombinedMotor');
goog.require('Blockly.FieldMotor');
goog.require('Blockly.Field');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

Blockly.FieldCombinedMotor = function (motorList, opt_validator) {
    this.motorList = motorList;
    this.rightList = motorList.slice(4);
    this.leftList = motorList.slice(0, 4);
    this.motor_ = [motorList[0], motorList[1]];
    this.combined_motor = this.motor_.join('+');
    Blockly.FieldCombinedMotor.superClass_.constructor.call(this, this.combined_motor, opt_validator);
    this.addArgType('combined_motor');
};
goog.inherits(Blockly.FieldCombinedMotor, Blockly.Field);

Blockly.FieldCombinedMotor.portList = [];
Blockly.FieldCombinedMotor.proxy = null;
// Blockly.FieldCombinedMotor.motor_svg = 'motor_sensing.svg';
// Blockly.FieldCombinedMotor.color_sensing_svg = 'color_sensing_svg';
// Blockly.FieldCombinedMotor.sound_sensing_svg = 'super_sound.svg';
// Blockly.FieldCombinedMotor.touch_sensing_svg = 'touch_press.svg';

/**
 * Construct a FieldCombinedMotor from a JSON arg object.
 * @param {!Object} options A JSON object with options (colour).
 * @returns {!Blockly.FieldCombinedMotor} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldCombinedMotor.fromJson = function (options) {
    return new Blockly.FieldCombinedMotor(options['motorList']);
};

Blockly.FieldCombinedMotor.prototype.btnList = null;

Blockly.FieldCombinedMotor.prototype.leftDom = null;

Blockly.FieldCombinedMotor.prototype.rightDom = null;

Blockly.FieldCombinedMotor.prototype.leftSideText = null;

Blockly.FieldCombinedMotor.prototype.rightSideText = null;

Blockly.FieldCombinedMotor.prototype.cacheProxy = new WeakMap();

Blockly.FieldCombinedMotor.prototype.init = function (block) {
    if (this.fieldGroup_) {
        // Colour slider has already been initialized once.
        return;
    }
    // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
    // Positioned on render, after text size is calculated.
    /** @type {Number} */
    this.arrowSize_ = 12;
    /** @type {Number} */
    this.arrowX_ = 0;
    /** @type {Number} */
    this.arrowY_ = 11;
    this.arrow_ = Blockly.utils.createSvgElement('image', {
        'height': this.arrowSize_ + 'px',
        'width': this.arrowSize_ + 'px'
    });
    this.arrow_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', Blockly.mainWorkspace.options.pathToMedia + 'dropdown-arrow.svg');
    this.className_ += ' blocklyDropdownText';

    Blockly.FieldCombinedMotor.superClass_.init.call(this, block);

    // If not in a shadow block, draw a box.
    if (!this.sourceBlock_.isShadow()) {
        this.box_ = Blockly.utils.createSvgElement('rect', {
            'rx': Blockly.BlockSvg.CORNER_RADIUS,
            'ry': Blockly.BlockSvg.CORNER_RADIUS,
            'x': 0,
            'y': 0,
            'width': this.size_.width,
            'height': this.size_.height,
            'stroke': this.sourceBlock_.getColourTertiary(),
            'fill': this.sourceBlock_.getColour(),
            'class': 'blocklyBlockBackground',
            'fill-opacity': 1
        }, null);
        this.fieldGroup_.insertBefore(this.box_, this.textElement_);
    }
    // Force a reset of the text to add the arrow.
    this.text_ = null;
    this.setText(this.combined_motor);

    this.leftDom = this.createMotorListDom_(this.leftList, 'left');
    this.rightDom = this.createMotorListDom_(this.rightList, 'right');
    const right = [...this.rightDom.childNodes];
    const left = [...this.leftDom.childNodes];
    this.btnList = [...left, ...right];

};


Blockly.FieldCombinedMotor.prototype.getValue = function () {
    return this.combined_motor;
};

Blockly.FieldCombinedMotor.prototype.setValue = function (motor) {
    if (this.sourceBlock_ && Blockly.Events.isEnabled() &&
        this.combined_motor != motor) {
        Blockly.Events.fire(new Blockly.Events.BlockChange(
            this.sourceBlock_, 'field', this.name, this.combined_motor, motor));
    }
    this.combined_motor = motor;
    this.setText(this.combined_motor);
};

Blockly.FieldCombinedMotor.prototype.setText = function (text) {
    if (text === null || text === this.text_) {
        // No change if null.
        return;
    }
    this.text_ = text;
    this.updateTextNode_();

    if (this.textElement_) {
        this.textElement_.parentNode.appendChild(this.arrow_);
    }
    if (this.sourceBlock_ && this.sourceBlock_.rendered) {
        this.sourceBlock_.render();
        this.sourceBlock_.bumpNeighbours_();
    }
};

Blockly.FieldCombinedMotor.prototype.positionArrow = function (x) {
    if (!this.arrow_) {
        return 0;
    }

    var addedWidth = 0;
    if (this.sourceBlock_.RTL) {
        this.arrowX_ = this.arrowSize_ - Blockly.BlockSvg.DROPDOWN_ARROW_PADDING;
        addedWidth = this.arrowSize_ + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING;
    } else {
        this.arrowX_ = x + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING / 2;
        addedWidth = this.arrowSize_ + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING;
    }
    if (this.box_) {
        // Bump positioning to the right for a box-type drop-down.
        this.arrowX_ += Blockly.BlockSvg.BOX_FIELD_PADDING;
    }
    this.arrow_.setAttribute('transform',
        'translate(' + this.arrowX_ + ',' + this.arrowY_ + ')');
    return addedWidth;
};

/**
 * 创建按钮列表
 * @param {*} list 
 * @param {*} side 
 * @returns 
 */
Blockly.FieldCombinedMotor.prototype.createMotorListDom_ = function (list, side) {
    const box = document.createElement('div');
    box.setAttribute('class', 'lls-port-selector__sensors lls-port-selector__sensors--' + side);
    for (let i = 0; i < list.length; i++) {
        const motor = document.createElement('div');
        motor.setAttribute('class', 'sensor-port-pair sensor-port-pair--dimmed');
        const btn = document.createElement('div');
        btn.setAttribute('class', 'button sensor-port-pair__port-button');
        btn.setAttribute('role', 'button');
        btn.setAttribute('data-testid', 'button-' + list[i]);
        if (this.motor_.includes(list[i])) {
            btn.classList.add('selected');
            btn.setAttribute('style', `color: ${this.sourceBlock_.getColour()}`);
        }
        btn.innerHTML = list[i];
        motor.appendChild(btn);
        box.appendChild(motor);
    }

    return box;
}

/**
 * 给dom绑定点击事件
 * @param {*} dom 
 */
Blockly.FieldCombinedMotor.prototype.handleClick_ = function (dom) {
    dom.onclick = () => {
        if (this.motor_.length === 2) {
            this.motor_.splice(0, this.motor_.length);
            for (let i = 0; i < this.btnList.length; i++) {
                const element = this.btnList[i].firstChild;
                element.classList.remove('selected');
                element.removeAttribute('style');
            }
        }
        const child = dom.firstChild;
        child.classList.add('selected');
        child.setAttribute('style', `color: ${this.sourceBlock_.getColour()}`);
        this.motor_.push(child.innerHTML);
        this.leftSideText.innerHTML = this.motor_[0] ? this.motor_[0] : '';
        this.rightSideText.innerHTML = this.motor_[1] ? this.motor_[1] : '';
        this.setValue(this.motor_.join('+'));
    }
}

/**
 * 判断数据值是什么类型的设备
 * @param {*} type 
 * @returns 
 */
Blockly.FieldCombinedMotor.prototype.checkType = function (type) {
    const str = Blockly.mainWorkspace.options.pathToMedia;
    const img = document.createElement('img');
    img.setAttribute('class', 'lls-dsm-icon');
    switch (type) {
        case 'motor':
        case 'big_motor':
            img.src = str + Blockly.FieldMotor.motor_svg;
            break;
        case 'small_motor':
            img.src = str + Blockly.FieldMotor.small_motor_svg;
            break;
        case 'gray':
        case 'color':
            img.src = str + Blockly.FieldMotor.color_sensing_svg;
            break;
        case 'superSound':
            img.src = str + Blockly.FieldMotor.sound_sensing_svg;
            break;
        case 'touch':
            img.src = str + Blockly.FieldMotor.touch_sensing_svg;
            break;
        default:
            return false;
    }
    return img;
}

Blockly.FieldCombinedMotor.prototype.createSideDom_ = function (side) {
    const div = document.createElement('div');
    div.setAttribute('class', `lls-port-selector__motor lls-port-selector__motor--${side} lls-port-selector__motor--highlight`);
    div.setAttribute('data-testid', 'left-motor-indicator');
    const icon = document.createElement('div');
    icon.setAttribute('class', 'lls-port-selector__motor-icon');
    div.appendChild(icon);
    const span = document.createElement('span');
    span.setAttribute('class', 'selected-motor-indicator');
    if (side === 'left') {
        span.innerHTML = this.motor_[0] ? this.motor_[0] : '';
        this.leftSideText = span;
    } else {
        span.innerHTML = this.motor_[1] ? this.motor_[1] : '';
        this.rightSideText = span;
    }

    icon.appendChild(span);
    return div;
}

/**
 * 创建电机dom
 * @returns 
 */
Blockly.FieldCombinedMotor.prototype.createMototDom_ = function () {
    const div = document.createElement('div');
    const selector = document.createElement('div');
    selector.setAttribute('class', 'lls-port-selector lls-port-selector--type-flipper');
    selector.setAttribute('style', `background-color: ${this.sourceBlock_.getColour()}`);
    div.appendChild(selector);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'lls-port-selector__hub-wrapper');
    const leftSide = this.createSideDom_('left');
    const rightSide = this.createSideDom_('right');
    selector.appendChild(wrapper);

    const hub = document.createElement('div');
    hub.setAttribute('class', 'lls-port-selector__hub');
    wrapper.appendChild(leftSide);
    wrapper.appendChild(hub);
    wrapper.appendChild(rightSide);

    hub.appendChild(this.leftDom);
    hub.appendChild(this.rightDom);

    for (let i = 0; i < this.btnList.length; i++) {
        this.handleClick_(this.btnList[i]);
    }

    const that = this;
    Blockly.FieldCombinedMotor.proxy = function () {
        if (that.cacheProxy.has(that.sourceBlock_)) {
            return that.cacheProxy.get(that.sourceBlock_);
        }
        let p = new Proxy(Blockly.FieldCombinedMotor, {
            get(target, key) {
                return Reflect.get(target, key);
            },
            set(target, key, value) {
                target[key] = value;
                if (key === 'portList') {
                    for (let i = 0; i < value.length; i++) {
                        const item = value[i];
                        const element = that.btnList[i];
                        const lastChild = that.checkType(item);
                        if (lastChild) {
                            if (element.childNodes.length > 1) continue;
                            element.appendChild(lastChild);
                        } else {
                            if (element.childNodes.length > 1) element.lastElementChild.remove();
                            continue;
                        }
                    }
                }
                return true;
            }
        });
        that.cacheProxy.set(that.sourceBlock_, p);
        return p;
    };

    return div;
};


Blockly.FieldCombinedMotor.prototype.showEditor_ = function () {
    Blockly.DropDownDiv.hideWithoutAnimation();
    Blockly.DropDownDiv.clearContent();
    var div = Blockly.DropDownDiv.getContentDiv();
    const motor = this.createMototDom_();
    div.appendChild(motor);

    Blockly.DropDownDiv.setColour(this.sourceBlock_.getColourTertiary(), this.sourceBlock_.getColourTertiary());
    Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
    Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

    this.setValue(this.getValue());
};

Blockly.FieldCombinedMotor.prototype.dispose = function () {
    this.motor_ = null;
    this.motorList = null;
    this.rightList = null;
    this.leftList = null;
    this.combined_motor = null;
    this.leftSideText = null;
    this.rightSideText = null;
    Blockly.FieldCombinedMotor.proxy = null;
    Blockly.Events.setGroup(false);
    Blockly.FieldCombinedMotor.superClass_.dispose.call(this);
};

Blockly.Field.register('field_combined_motor', Blockly.FieldCombinedMotor);