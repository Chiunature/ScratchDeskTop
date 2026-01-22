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

/**
 * 端口设备类型列表
 * 【说明】存储每个端口对应的设备类型（如 "motor", "color", "touch" 等）
 * 【更新时机】当设备数据更新时，通过 Proxy 设置此值会触发 DOM 更新
 * 【示例】["motor", "color", null, "touch", ...]
 */
Blockly.FieldMotor.portList = [];

/**
 * Proxy 函数，用于创建拦截 Blockly.FieldMotor 属性设置的代理对象
 * 【说明】使用全局 Proxy，监听 portList 的变化
 */
Blockly.FieldMotor.proxy = function () {
  if (Blockly.FieldMotor._globalProxy) {
    return Blockly.FieldMotor._globalProxy;
  }
  const p = new Proxy(
    Blockly.FieldMotor,
    Blockly.FieldMotor._createGlobalProxyHandler()
  );
  Blockly.FieldMotor._globalProxy = p;
  return p;
};
Blockly.FieldMotor.small_motor_svg = "small_motor_sensing.svg";
Blockly.FieldMotor.motor_svg = "motor_sensing.svg";
Blockly.FieldMotor.color_sensing_svg = "color_sensing.svg";
Blockly.FieldMotor.sound_sensing_svg = "super_sound.svg";
Blockly.FieldMotor.touch_sensing_svg = "touch_press.svg";
Blockly.FieldMotor.camera_sensing_svg = "camera.svg";
Blockly.FieldMotor.nfc_sensing_svg = "nfc.svg";
Blockly.FieldMotor.lightIntensity_svg = "lightIntensity.svg";
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

Blockly.FieldMotor.timer = null;
Blockly.FieldMotor.callback = null;
/**
 * 所有 FieldMotor 实例的列表
 * 【说明】用于在 portList 被设置时，更新所有实例的图标
 * 【注意】使用 WeakRef 可以避免内存泄漏，但需要手动清理
 */
Blockly.FieldMotor.instances = [];

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
    return !this.isNullPort_(allPorts[index]);
  });

  // 将当前实例添加到实例列表中（使用 WeakRef 避免内存泄漏）
  Blockly.FieldMotor.instances.push(new WeakRef(this));

  // 【调试日志】记录实例初始化

  // 【关键修复】在 init 时就创建 Proxy，确保即使没有打开下拉菜单也能显示图标
  // 这样当 portList 被设置时，Proxy 拦截器就能正常工作
  // 这对于 shadow block 尤其重要，因为用户可能不会打开下拉菜单
  this.ensureProxyCreated_();
};

/**
 * 确保 Proxy 被创建
 * 【说明】Proxy 用于拦截 portList 的设置，更新 DOM 中的图标
 * 【问题】如果用户从来没有打开过下拉菜单，Proxy 就不会被创建，导致图标不显示
 * 【解决】在 init 时就创建 Proxy，确保图标能正常显示
 * @private
 */
Blockly.FieldMotor.prototype.ensureProxyCreated_ = function () {
  // 如果 Proxy 已经创建，直接返回
  if (Blockly.FieldMotor._globalProxy) {
    return;
  }

  // 如果 btnList 还没有初始化，无法创建 Proxy（需要 btnList 来更新图标）
  if (!this.btnList || this.btnList.length === 0) {
    return;
  }
  // 调用 createProxy_ 方法创建 Proxy
  this.createProxy_();
};

/**
 * 创建 Proxy 对象
 * 【说明】提取 Proxy 创建逻辑，供 ensureProxyCreated_ 复用
 * 【关键】所有 FieldMotor 实例共享同一个 Proxy，它拦截静态属性 portList 的设置
 * @private
 */
Blockly.FieldMotor.prototype.createProxy_ = function () {
  return Blockly.FieldMotor.proxy();
};

/**
 * 创建全局 Proxy 的 handler 对象
 * 【说明】这个 handler 会更新所有 FieldMotor 实例的图标
 * @returns {Object} Proxy handler 对象
 * @private
 */
Blockly.FieldMotor._createGlobalProxyHandler = function () {
  return {
    /**
     * 拦截属性读取操作
     */
    get(target, key) {
      return Reflect.get(target, key);
    },

    /**
     * 拦截属性设置操作
     */
    set(target, key, value) {
      // 当设置 portList 时，先检查值是否真的改变了
      if (key === "portList") {
        // 【关键优化】在设置值之前保存旧值进行比较
        const oldValue = target[key];

        // 深度比较数组是否相同
        const isSame =
          Array.isArray(oldValue) &&
          Array.isArray(value) &&
          oldValue.length === value.length &&
          oldValue.every((val, idx) => val === value[idx]);

        // 【性能优化】如果值相同，直接返回，不进行任何 DOM 操作
        if (isSame) {
          target[key] = value;
          return true;
        }

        // 设置新值
        target[key] = value;

        // 【关键】更新所有 FieldMotor 实例的图标
        // 清理已销毁的实例引用
        let updatedCount = 0;
        let destroyedCount = 0;
        Blockly.FieldMotor.instances = Blockly.FieldMotor.instances.filter(
          (ref) => {
            const instance = ref.deref();
            if (!instance) {
              destroyedCount++;
              return false; // 实例已销毁，移除引用
            }

            // 更新当前实例的图标
            if (instance.btnList && instance.btnList.length > 0) {
              updatedCount++;
              instance.updateIconsForPortList_(value);
            }

            return true; // 保留引用
          }
        );
      } else {
        // 其他属性正常设置
        target[key] = value;
      }
      return true;
    },
  };
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
    if (this.isNullPort_(list[i])) {
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
 * 判断端口是否为空（null / "null" / "NULL"）
 * @param {*} port
 * @returns {boolean}
 * @private
 */
Blockly.FieldMotor.prototype.isNullPort_ = function (port) {
  return port === null || port === "null" || port === "NULL";
};

/**
 * 获取设备类型对应的图标路径（不创建 DOM 元素）
 * 【性能优化】用于比较当前图标和目标图标，避免不必要的 DOM 操作
 * @param {string} type - 设备类型
 * @returns {string|false} 返回图标路径，如果类型不匹配则返回 false
 */
Blockly.FieldMotor.prototype.getIconSrc = function (type) {
  const str = Blockly.mainWorkspace.options.pathToMedia;
  switch (type) {
    case "motor":
    case "big_motor":
      return str + Blockly.FieldMotor.motor_svg;
    case "small_motor":
      return str + Blockly.FieldMotor.small_motor_svg;
    case "gray":
    case "color":
      return str + Blockly.FieldMotor.color_sensing_svg;
    case "superSound":
      return str + Blockly.FieldMotor.sound_sensing_svg;
    case "touch":
      return str + Blockly.FieldMotor.touch_sensing_svg;
    case "camer":
      return str + Blockly.FieldMotor.camera_sensing_svg;
    case "nfc":
      return str + Blockly.FieldMotor.nfc_sensing_svg;
    case "lightIntensity":
      return str + Blockly.FieldMotor.lightIntensity_svg;
    default:
      return false;
  }
};

/**
 * 根据指定的 portList 更新图标（复用逻辑）
 * @param {Array} portList
 * @private
 */
Blockly.FieldMotor.prototype.updateIconsForPortList_ = function (portList) {
  const list = Array.isArray(portList) ? portList : [];

  if (!this.btnList || this.btnList.length === 0) {
    return;
  }

  // 创建索引映射：portList 索引 -> btnList 索引
  let btnListIndex = 0;

  // 遍历 motorList，确保缺失端口也会清理图标
  for (let i = 0; i < this.motorList.length; i++) {
    const item = list[i];

    // 跳过 null 端口（这些端口在 btnList 中不存在）
    if (this.isNullPort_(this.motorList[i])) {
      continue;
    }

    // 使用映射后的索引访问 btnList
    if (btnListIndex < this.btnList.length) {
      const element = this.btnList[btnListIndex];

      // 检查当前 DOM 状态
      const currentLastChild = element.lastElementChild;
      const hasImage = currentLastChild && currentLastChild.tagName === "IMG";

      // 获取期望的图标路径（不创建元素）
      const expectedSrc = this.getIconSrc(item);

      if (expectedSrc) {
        // 需要显示图标
        if (!hasImage) {
          // 当前没有图标,创建并添加
          const img = this.checkType(item);
          if (img) {
            element.appendChild(img);
          }
        } else {
          // 检查当前图标是否已经是正确的图标
          const currentSrc = currentLastChild.getAttribute("src");
          if (currentSrc !== expectedSrc) {
            // 图标不同,替换图标
            currentLastChild.remove();
            const img = this.checkType(item);
            if (img) {
              element.appendChild(img);
            }
          } else {
          }
        }
      } else {
        // 不需要显示图标（未知类型或 noDevice）
        if (hasImage) {
          // 当前有图标,移除图标
          currentLastChild.remove();
        }
      }
      btnListIndex++;
    }
  }
};

/**
 * 根据当前 portList 更新下拉菜单中的图标
 * 【说明】在打开下拉菜单时调用,确保显示最新的设备状态
 * @private
 */
Blockly.FieldMotor.prototype.updateIconsFromPortList_ = function () {
  this.updateIconsForPortList_(Blockly.FieldMotor.portList || []);
};

/**
 * 判断数据值是什么类型的设备，并创建对应的图标元素
 * 【性能优化】现在只在真正需要创建图标时才调用此方法
 * 【调用位置】在 Proxy 的 set 拦截器中，当 portList 更新且需要创建新图标时被调用
 * @param {string} type - 设备类型（如 "motor", "color", "touch" 等）
 * @returns {HTMLImageElement|false} 返回创建的 img 元素，如果类型不匹配则返回 false
 */
Blockly.FieldMotor.prototype.checkType = function (type) {
  const src = this.getIconSrc(type);
  if (!src) {
    return false;
  }
  const img = document.createElement("img");
  img.setAttribute("class", "lls-dsm-icon");
  img.src = src;

  return img;
};

/**
 * 创建电机选择器的 DOM 结构
 * 【说明】创建下拉菜单的 DOM，包含左右两侧的端口按钮列表
 * 【关键】仅创建 DOM，不在这里创建 Proxy
 * @returns {HTMLElement} 返回包含整个选择器的 div 元素
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

  // 为每个按钮绑定点击事件
  for (let i = 0; i < this.btnList.length; i++) {
    this.handleClick_(this.btnList[i]);
  }

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

  // 【关键修复】打开下拉菜单后,立即根据当前 portList 更新图标
  // 这样可以确保下拉菜单显示的是最新的设备状态
  this.updateIconsFromPortList_();

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
  Blockly.Events.setGroup(false);
  Blockly.FieldMotor.superClass_.dispose.call(this);
};

Blockly.Field.register("field_motor", Blockly.FieldMotor);
