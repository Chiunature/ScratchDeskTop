'use strict';

goog.provide('Blockly.FieldMotor');
goog.require('Blockly.Field');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

Blockly.FieldMotor = function (motorList, opt_validator) {
    this.motorList = motorList;
    this.rightList = motorList.slice(0, 4).reverse();
    this.leftList = motorList.slice(4);
    this.motor_ = motorList[0];
    Blockly.FieldMotor.superClass_.constructor.call(this, this.motor_, opt_validator);
    this.addArgType('motor');
};
goog.inherits(Blockly.FieldMotor, Blockly.Field);

Blockly.FieldMotor.portList = [];
Blockly.FieldMotor.proxy = null;
/**
 * Construct a FieldMotor from a JSON arg object.
 * @param {!Object} options A JSON object with options (colour).
 * @returns {!Blockly.FieldMotor} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldMotor.fromJson = function (options) {
    return new Blockly.FieldMotor(options['motorList']);
};

Blockly.FieldMotor.prototype.btnList = null;

Blockly.FieldMotor.prototype.init = function (block) {
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

    Blockly.FieldMotor.superClass_.init.call(this, block);

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
    this.setText(this.motor_);
};


Blockly.FieldMotor.prototype.getValue = function () {
    return this.motor_;
};

Blockly.FieldMotor.prototype.setValue = function (motor) {
    if (this.sourceBlock_ && Blockly.Events.isEnabled() &&
        this.motor_ != motor) {
        Blockly.Events.fire(new Blockly.Events.BlockChange(
            this.sourceBlock_, 'field', this.name, this.motor_, motor));
    }
    this.motor_ = motor;
    this.setText(this.motor_);
};

Blockly.FieldMotor.prototype.setText = function (text) {
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

Blockly.FieldMotor.prototype.positionArrow = function (x) {
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
 * 创建电机dom
 * @returns 
 */
Blockly.FieldMotor.prototype.createMototDom_ = function () {
    const div = document.createElement('div');
    const selector = document.createElement('div');
    selector.setAttribute('class', 'lls-port-selector lls-port-selector--type-flipper lls-port-selector--no-motors');
    selector.setAttribute('style', `background-color: ${this.sourceBlock_.getColour()}`);
    div.appendChild(selector);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'lls-port-selector__hub-wrapper');
    selector.appendChild(wrapper);

    const hub = document.createElement('div');
    hub.setAttribute('class', 'lls-port-selector__hub');
    wrapper.appendChild(hub);

    const createMotorListDom_ = (list, side) => {
        const box = document.createElement('div');
        box.setAttribute('class', 'lls-port-selector__sensors lls-port-selector__sensors--' + side);
        for (let i = 0; i < list.length; i++) {
            const motor = document.createElement('div');
            motor.setAttribute('class', 'sensor-port-pair sensor-port-pair--dimmed');
            const btn = document.createElement('div');
            btn.setAttribute('class', 'button sensor-port-pair__port-button');
            btn.setAttribute('role', 'button');
            btn.setAttribute('data-testid', 'button-' + list[i]);
            if (this.motor_ === list[i]) {
                btn.classList.add('selected');
                btn.setAttribute('style', `color: ${this.sourceBlock_.getColour()}`);
            }
            btn.innerHTML = list[i];
            motor.appendChild(btn);
            box.appendChild(motor);
        }
        return box;
    }
    const left = createMotorListDom_(this.leftList, 'left');
    const right = createMotorListDom_(this.rightList, 'right');
    hub.appendChild(left);
    hub.appendChild(right);

    const btnList = [...left.childNodes, ...right.childNodes];
    const handleClick_ = (dom) => {
        dom.onclick = () => {
            for (let i = 0; i < btnList.length; i++) {
                const element = btnList[i];
                const child = element.firstChild;
                if (element === dom) {
                    child.classList.add('selected');
                    child.setAttribute('style', `color: ${this.sourceBlock_.getColour()}`);
                    this.setValue(child.innerHTML);
                } else {
                    child.classList.remove('selected');
                    child.removeAttribute('style');
                }
            }
        }
    }
    for (let i = 0; i < btnList.length; i++) {
        const element = btnList[i];
        handleClick_(element);
    }

    Blockly.FieldMotor.proxy = function () {
        return new Proxy(Blockly.FieldMotor, {
            get(target, key) {
                return Reflect.get(target, key);
            },
            set(target, key, value) {
                target[key] = value;
                return true;
            }
        });
    };

    return div;
};


Blockly.FieldMotor.prototype.showEditor_ = function () {
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

Blockly.FieldMotor.prototype.dispose = function () {
    this.motor_ = null;
    this.motorList = null;
    this.rightList = null;
    this.leftList = null;
    Blockly.FieldMotor.proxy = null;
    Blockly.Events.setGroup(false);
    Blockly.FieldMotor.superClass_.dispose.call(this);
};

Blockly.Field.register('field_motor', Blockly.FieldMotor);