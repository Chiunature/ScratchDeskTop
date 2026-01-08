"use strict";

goog.provide("Blockly.FieldMotor");
goog.require("Blockly.Field");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.style");

// linepatrol = [1,2,3,4]
Blockly.FieldMotor = function (motorList, linepatrol, opt_validator) {
  this.motorList = motorList;
  this.rightList = motorList.slice(4);
  this.leftList = motorList.slice(0, 4);
  // 找到第一个非 null 的端口作为默认值
  this.motor_ =
    motorList.find((m) => m !== null && m !== "null" && m !== "NULL") ||
    motorList[0];
  if (linepatrol) {
    this.linepatrolList = linepatrol;
    this.linepatrol_ = linepatrol[0];
  }
  Blockly.FieldMotor.superClass_.constructor.call(
    this,
    this.motor_,
    this.linepatrol_,
    opt_validator
  );
  this.addArgType("motor");
};
goog.inherits(Blockly.FieldMotor, Blockly.Field);

Blockly.FieldMotor.portList = [];
Blockly.FieldMotor.proxy = null;
Blockly.FieldMotor.small_motor_svg = "small_motor_sensing.svg";
Blockly.FieldMotor.motor_svg = "motor_sensing.svg";
Blockly.FieldMotor.color_sensing_svg = "color_sensing.svg";
Blockly.FieldMotor.sound_sensing_svg = "super_sound.svg";
Blockly.FieldMotor.touch_sensing_svg = "touch_press.svg";
Blockly.FieldMotor.camera_sensing_svg = "camera.svg";
Blockly.FieldMotor.nfc_sensing_svg = "nfc.svg";
/**
 * Construct a FieldMotor from a JSON arg object.
 * @param {!Object} options A JSON object with options (colour).
 * @returns {!Blockly.FieldMotor} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldMotor.fromJson = function (options) {
  return new Blockly.FieldMotor(options["motorList"], options["linepatrol"]);
};

Blockly.FieldMotor.prototype.btnList = null;

Blockly.FieldMotor.prototype.leftDom = null;

Blockly.FieldMotor.prototype.rightDom = null;

Blockly.FieldMotor.prototype.cacheProxy = new WeakMap();
Blockly.FieldMotor.timer = null;
Blockly.FieldMotor.callback = null;

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
  this.arrowY_ = (Blockly.BlockSvg.FIELD_HEIGHT - this.arrowSize_) / 2;
  this.arrow_ = Blockly.utils.createSvgElement("image", {
    height: this.arrowSize_ + "px",
    width: this.arrowSize_ + "px",
  });
  this.arrow_.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    Blockly.mainWorkspace.options.pathToMedia + "dropdown-arrow.svg"
  );
  this.className_ += " blocklyDropdownText";

  Blockly.FieldMotor.superClass_.init.call(this, block);

  // If not in a shadow block, draw a box.
  if (!this.sourceBlock_.isShadow()) {
    this.box_ = Blockly.utils.createSvgElement(
      "rect",
      {
        rx: Blockly.BlockSvg.CORNER_RADIUS,
        ry: Blockly.BlockSvg.CORNER_RADIUS,
        x: 0,
        y: 0,
        width: this.size_.width,
        height: this.size_.height,
        stroke: this.sourceBlock_.getColourTertiary(),
        fill: this.sourceBlock_.getColour(),
        class: "blocklyBlockBackground",
        "fill-opacity": 1,
      },
      null
    );
    this.fieldGroup_.insertBefore(this.box_, this.textElement_);
  }
  // Force a reset of the text to add the arrow.
  this.text_ = null;

  if (this.motor_ && this.linepatrol_) {
    this.setText(this.motor_ + "->" + this.linepatrol_);
  } else {
    this.setText(this.motor_);
  }

  if (this.linepatrol_) {
    this.linepatrolDom = this.createLinepatrolDom_(this.linepatrolList);
  }

  this.leftDom = this.createMotorListDom_(this.leftList, "left");
  this.rightDom = this.createMotorListDom_(this.rightList, "right");
  const right = [...this.rightDom.childNodes];
  const left = [...this.leftDom.childNodes];
  // 过滤掉禁用的按钮（对应 null 端口）
  this.btnList = [...left, ...right].filter((element, index) => {
    const allPorts = [...this.leftList, ...this.rightList];
    return (
      allPorts[index] !== null &&
      allPorts[index] !== "null" &&
      allPorts[index] !== "NULL"
    );
  });
};

Blockly.FieldMotor.prototype.getValue = function () {
  return this.motor_;
};

Blockly.FieldMotor.prototype.setValue = function (motor) {
  if (this.sourceBlock_ && Blockly.Events.isEnabled() && this.motor_ != motor) {
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(
        this.sourceBlock_,
        "field",
        this.name,
        this.motor_,
        motor
      )
    );
  }
  this.motor_ = motor;
  this.setText(motor);
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
  this.arrow_.setAttribute(
    "transform",
    "translate(" + this.arrowX_ + "," + this.arrowY_ + ")"
  );
  return addedWidth;
};

Blockly.FieldMotor.prototype.createLinepatrolDom_ = function (list) {
  const box = document.createElement("ul");
  box.setAttribute("class", "linepatrol-list");

  for (let i = 0; i < list.length; i++) {
    const item = document.createElement("li");
    item.innerHTML = list[i];
    if (this.linepatrol_ === list[i]) {
      item.classList.add("selected");
      item.setAttribute("style", `color: ${this.sourceBlock_.getColour()}`);
    }
    box.appendChild(item);
  }

  box.onclick = (e) => {
    for (let i = 0; i < this.linepatrolList.length; i++) {
      const child = box.childNodes[i];
      child.classList.remove("selected");
      child.removeAttribute("style");
    }
    if (e.target.tagName === "LI") {
      this.linepatrol_ = e.target.innerHTML;
      e.target.classList.add("selected");
      e.target.setAttribute("style", `color: ${this.sourceBlock_.getColour()}`);
      this.motor_ = this.motor_.split("->")[0];
      this.setValue(this.motor_ + "->" + this.linepatrol_);
    }
  };

  return box;
};

/**
 * 创建按钮列表
 * @param {*} list
 * @param {*} side
 * @returns
 */
Blockly.FieldMotor.prototype.createMotorListDom_ = function (list, side) {
  const box = document.createElement("div");
  box.setAttribute(
    "class",
    "lls-port-selector__sensors lls-port-selector__sensors--" + side
  );
  for (let i = 0; i < list.length; i++) {
    const motor = document.createElement("div");
    motor.setAttribute("class", "sensor-port-pair sensor-port-pair--dimmed");
    const btn = document.createElement("div");
    btn.setAttribute("class", "button sensor-port-pair__port-button");
    btn.setAttribute("role", "button");
    btn.setAttribute("data-testid", "button-" + list[i]);

    // 检查是否为 null，如果是则禁用按钮
    if (list[i] === null || list[i] === "null" || list[i] === "NULL") {
      btn.classList.add("disabled");
      btn.setAttribute(
        "style",
        "opacity: 0.3; cursor: not-allowed; pointer-events: none;"
      );
      btn.innerHTML = ""; // 空白显示
    } else {
      if (this.motor_ === list[i]) {
        btn.classList.add("selected");
        btn.setAttribute("style", `color: ${this.sourceBlock_.getColour()}`);
      }
      btn.innerHTML = list[i];
    }

    motor.appendChild(btn);
    box.appendChild(motor);
  }

  return box;
};

/**
 * 给dom绑定点击事件
 * @param {*} dom
 */
Blockly.FieldMotor.prototype.handleClick_ = function (dom) {
  dom.onclick = () => {
    for (let i = 0; i < this.btnList.length; i++) {
      const element = this.btnList[i];
      const child = element.firstChild;
      if (element === dom) {
        child.classList.add("selected");
        child.setAttribute("style", `color: ${this.sourceBlock_.getColour()}`);
        if (this.linepatrol_) {
          this.setValue(child.innerHTML + "->" + this.linepatrol_);
        } else {
          this.setValue(child.innerHTML);
        }
      } else {
        child.classList.remove("selected");
        child.removeAttribute("style");
      }
    }
  };
};

/**
 * 判断数据值是什么类型的设备
 * @param {*} type
 * @returns
 */
Blockly.FieldMotor.prototype.checkType = function (type) {
  const str = Blockly.mainWorkspace.options.pathToMedia;
  const img = document.createElement("img");
  img.setAttribute("class", "lls-dsm-icon");
  switch (type) {
    case "motor":
    case "big_motor":
      img.src = str + Blockly.FieldMotor.motor_svg;
      break;
    case "small_motor":
      img.src = str + Blockly.FieldMotor.small_motor_svg;
      break;
    case "gray":
    case "color":
      img.src = str + Blockly.FieldMotor.color_sensing_svg;
      break;
    case "superSound":
      img.src = str + Blockly.FieldMotor.sound_sensing_svg;
      break;
    case "touch":
      img.src = str + Blockly.FieldMotor.touch_sensing_svg;
      break;
    case "camer":
      img.src = str + Blockly.FieldMotor.camera_sensing_svg;
      break;
    case "nfc":
      img.src = str + Blockly.FieldMotor.nfc_sensing_svg;
      break;
    default:
      return false;
  }
  return img;
};

/**
 * 创建电机dom
 * @returns
 */
Blockly.FieldMotor.prototype.createMototDom_ = function () {
  const div = document.createElement("div");
  div.setAttribute(
    "style",
    `background-color: ${this.sourceBlock_.getColour()};padding:5px 0;`
  );

  if (this.linepatrolDom) {
    div.appendChild(this.linepatrolDom);
  }

  const selector = document.createElement("div");
  selector.setAttribute(
    "class",
    "lls-port-selector lls-port-selector--type-flipper lls-port-selector--no-motors"
  );
  div.appendChild(selector);

  const wrapper = document.createElement("div");
  wrapper.setAttribute("class", "lls-port-selector__hub-wrapper");
  selector.appendChild(wrapper);

  const hub = document.createElement("div");
  hub.setAttribute("class", "lls-port-selector__hub");
  wrapper.appendChild(hub);

  hub.appendChild(this.leftDom);
  hub.appendChild(this.rightDom);

  for (let i = 0; i < this.btnList.length; i++) {
    this.handleClick_(this.btnList[i]);
  }

  const that = this;
  Blockly.FieldMotor.proxy = function () {
    if (that.cacheProxy.has(that.sourceBlock_)) {
      return that.cacheProxy.get(that.sourceBlock_);
    }
    let p = new Proxy(Blockly.FieldMotor, {
      get(target, key) {
        return Reflect.get(target, key);
      },
      set(target, key, value) {
        target[key] = value;
        if (key === "portList") {
          // 创建索引映射：portList 索引 -> btnList 索引
          let btnListIndex = 0;
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            // 跳过 null 端口
            if (
              that.motorList[i] === "null" ||
              that.motorList[i] === null ||
              that.motorList[i] === "NULL"
            ) {
              continue;
            }
            // 使用映射后的索引访问 btnList
            if (btnListIndex < that.btnList.length) {
              const element = that.btnList[btnListIndex];
              const lastChild = that.checkType(item);
              if (lastChild) {
                if (element.childNodes.length > 1) continue;
                element.appendChild(lastChild);
              } else {
                if (element.childNodes.length > 1)
                  element.lastElementChild.remove();
                continue;
              }
              btnListIndex++;
            }
          }
        }
        return true;
      },
    });
    that.cacheProxy.set(that.sourceBlock_, p);
    return p;
  };

  return div;
};

Blockly.FieldMotor.prototype.showEditor_ = function () {
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var div = Blockly.DropDownDiv.getContentDiv();
  const motor = this.createMototDom_();
  div.appendChild(motor);

  Blockly.DropDownDiv.setColour(
    this.sourceBlock_.getColourTertiary(),
    this.sourceBlock_.getColourTertiary()
  );
  Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  if (this.linepatrol_) {
    this.motor_ = this.motor_.split("->")[0];
    this.setValue(this.motor_ + "->" + this.linepatrol_);
  } else {
    this.setValue(this.getValue());
  }
};

Blockly.FieldMotor.prototype.changeMotor = function (type, obj) {
  if (typeof Blockly.FieldMotor.callback === "function") {
    clearTimeout(Blockly.FieldMotor.timer);
    Blockly.FieldMotor.timer = setTimeout(() => {
      switch (type) {
        case "speed":
          Blockly.FieldMotor.callback(type, {
            port: _getPort(obj.port),
            speed: obj.value,
          });
          break;
        case "spin":
          Blockly.FieldMotor.callback(type, {
            port: _getPort(obj.port),
            spin: obj.value,
          });
          break;
        case "spinCirle":
          Blockly.FieldMotor.callback(type, {
            port: _getPort(obj.port),
            value: obj.value,
            spin: obj.spin === "Advance" ? "01" : "-1",
            type: obj.type,
          });
          break;
        default:
          break;
      }
    }, 500);
  }

  function _getPort(port) {
    switch (port) {
      case "A":
        return "00";
      case "B":
        return "01";
      case "C":
        return "02";
      case "D":
        return "03";
      case "E":
        return "04";
      case "F":
        return "05";
      case "G":
        return "06";
      case "H":
        return "07";
      default:
        return;
    }
  }
};

Blockly.FieldMotor.prototype.dispose = function () {
  this.motor_ = null;
  this.motorList = null;
  this.rightList = null;
  this.leftList = null;
  this.linepatrolList = null;
  this.linepatrol_ = null;
  Blockly.FieldMotor.proxy = null;
  Blockly.Events.setGroup(false);
  Blockly.FieldMotor.superClass_.dispose.call(this);
};

Blockly.Field.register("field_motor", Blockly.FieldMotor);
