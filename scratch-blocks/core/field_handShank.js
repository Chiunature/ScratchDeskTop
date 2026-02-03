"use strict";

goog.provide("Blockly.FieldHandShank");
goog.require("Blockly.Field");

// ============= 1. 构造函数 =============
Blockly.FieldHandShank = function (handShankList, opt_validator) {
  // 存储完整的选项列表
  this.handShankList_ = handShankList;

  // 找到第一个值作为默认值
  this.handShankValue_ = this.handShankList_[0] || "up";

  // 调用父类构造函数
  Blockly.FieldHandShank.superClass_.constructor.call(
    this,
    this.handShankValue_,
    opt_validator
  );

  this.addArgType("handShank");
};

goog.inherits(Blockly.FieldHandShank, Blockly.Field);

// ============= 2. fromJson 静态方法 =============
Blockly.FieldHandShank.fromJson = function (options) {
  return new Blockly.FieldHandShank(options["handShankValue"]);
};

// ============= 3. 初始化方法 =============
Blockly.FieldHandShank.prototype.init = function (block) {
  if (this.fieldGroup_) {
    return;
  }

  this.arrowSize_ = 12;
  this.arrowX_ = 0;
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
  Blockly.FieldHandShank.superClass_.init.call(this, block);

  if (!this.sourceBlock_.isShadow()) {
    this.box_ = Blockly.utils.createSvgElement("rect", {
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
    });
    this.fieldGroup_.insertBefore(this.box_, this.textElement_);
  }

  this.text_ = null;
  this.setText(this.handShankValue_);

  // 创建选项按钮列表
  this.createButtonList_();
};

// ============= 创建按钮列表 =============
Blockly.FieldHandShank.prototype.createButtonList_ = function () {
  this.buttonList_ = [];
  for (var i = 0; i < this.handShankList_.length; i++) {
    var btn = {
      value: this.handShankList_[i],
      selected: this.handShankList_[i] === this.handShankValue_,
    };
    this.buttonList_.push(btn);
  }
};

// ============= 4. getValue 方法 =============
Blockly.FieldHandShank.prototype.getValue = function () {
  return this.handShankValue_;
};

// ============= 5. setValue 方法 =============
Blockly.FieldHandShank.prototype.setValue = function (newValue) {
  if (
    this.sourceBlock_ &&
    Blockly.Events.isEnabled() &&
    this.handShankValue_ != newValue
  ) {
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(
        this.sourceBlock_,
        "field",
        this.name,
        this.handShankValue_,
        newValue
      )
    );
  }
  this.handShankValue_ = newValue;
  this.setText(newValue);
};

// ============= 6. setText 方法 =============
Blockly.FieldHandShank.prototype.setText = function (text) {
  if (text === null || text === this.text_) {
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

// ============= 6.5. positionArrow 方法 - 定位下拉箭头 =============
Blockly.FieldHandShank.prototype.positionArrow = function (x) {
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

// ============= 7. showEditor_ 方法 =============
Blockly.FieldHandShank.prototype.showEditor_ = function () {
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();

  var div = Blockly.DropDownDiv.getContentDiv();
  const handShankDom = this.createHandShankDom_();
  div.appendChild(handShankDom);

  Blockly.DropDownDiv.setColour(
    this.sourceBlock_.getColourTertiary(),
    this.sourceBlock_.getColourTertiary()
  );
  Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);
};

// ============= 8. 创建下拉菜单 DOM =============
Blockly.FieldHandShank.prototype.createHandShankDom_ = function () {
  const div = document.createElement("div");
  div.setAttribute(
    "style",
    `background: linear-gradient(135deg, ${this.sourceBlock_.getColour()} 0%, ${this.sourceBlock_.getColourSecondary()} 100%);
     padding:20px; 
     border-radius: 12px; 
     box-shadow: 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);`
  );

  // 创建 SVG 画布
  const svg = Blockly.utils.createSvgElement("svg", {
    width: "450",
    height: "250",
    viewBox: "0 0 450 250",
    style: `background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
            border-radius: 8px; 
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1);`,
  });

  // =================== 定义渐变和滤镜 ===================
  const defs = Blockly.utils.createSvgElement("defs", {});

  // 手柄主体渐变
  const bodyGradient = Blockly.utils.createSvgElement("linearGradient", {
    id: "bodyGradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  });
  const stop1 = Blockly.utils.createSvgElement("stop", {
    offset: "0%",
    style: "stop-color:#ffffff;stop-opacity:1",
  });
  const stop2 = Blockly.utils.createSvgElement("stop", {
    offset: "100%",
    style: "stop-color:#e0e0e0;stop-opacity:1",
  });
  bodyGradient.appendChild(stop1);
  bodyGradient.appendChild(stop2);
  defs.appendChild(bodyGradient);

  // 阴影滤镜
  const shadow = Blockly.utils.createSvgElement("filter", {
    id: "dropShadow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
  });
  const feGaussianBlur = Blockly.utils.createSvgElement("feGaussianBlur", {
    in: "SourceAlpha",
    stdDeviation: "3",
  });
  const feOffset = Blockly.utils.createSvgElement("feOffset", {
    dx: "2",
    dy: "3",
    result: "offsetblur",
  });
  const feFlood = Blockly.utils.createSvgElement("feFlood", {
    "flood-color": "#000000",
    "flood-opacity": "0.3",
  });
  const feComposite = Blockly.utils.createSvgElement("feComposite", {
    in2: "offsetblur",
    operator: "in",
  });
  const feMerge = Blockly.utils.createSvgElement("feMerge", {});
  const feMergeNode1 = Blockly.utils.createSvgElement("feMergeNode", {});
  const feMergeNode2 = Blockly.utils.createSvgElement("feMergeNode", {
    in: "SourceGraphic",
  });
  feMerge.appendChild(feMergeNode1);
  feMerge.appendChild(feMergeNode2);
  shadow.appendChild(feGaussianBlur);
  shadow.appendChild(feOffset);
  shadow.appendChild(feFlood);
  shadow.appendChild(feComposite);
  shadow.appendChild(feMerge);
  defs.appendChild(shadow);

  // 按钮高光渐变
  const buttonGradient = Blockly.utils.createSvgElement("radialGradient", {
    id: "buttonGradient",
    cx: "30%",
    cy: "30%",
  });
  const btnStop1 = Blockly.utils.createSvgElement("stop", {
    offset: "0%",
    style: "stop-color:#ffffff;stop-opacity:0.8",
  });
  const btnStop2 = Blockly.utils.createSvgElement("stop", {
    offset: "100%",
    style: "stop-color:#e0e0e0;stop-opacity:1",
  });
  buttonGradient.appendChild(btnStop1);
  buttonGradient.appendChild(btnStop2);
  defs.appendChild(buttonGradient);

  svg.appendChild(defs);

  // =================== 绘制手柄主体轮廓（带阴影和渐变）===================
  // 中间连接部分（矩形）- 阴影层
  const middleBodyShadow = Blockly.utils.createSvgElement("rect", {
    x: "92",
    y: "58",
    width: "270",
    height: "130",
    fill: "#000000",
    opacity: "0.15",
    rx: "3",
  });
  svg.appendChild(middleBodyShadow);

  // 中间连接部分（矩形）- 主体
  const middleBody = Blockly.utils.createSvgElement("rect", {
    x: "90",
    y: "55",
    width: "270",
    height: "130",
    fill: "url(#bodyGradient)",
    stroke: "#333",
    "stroke-width": "4",
    filter: "url(#dropShadow)",
  });
  svg.appendChild(middleBody);

  // 左侧圆形手柄 - 阴影层
  const leftHandleShadow = Blockly.utils.createSvgElement("circle", {
    cx: "92",
    cy: "128",
    r: "70",
    fill: "#000000",
    opacity: "0.15",
  });
  svg.appendChild(leftHandleShadow);

  // 左侧圆形手柄 - 主体
  const leftHandle = Blockly.utils.createSvgElement("circle", {
    cx: "90",
    cy: "125",
    r: "70",
    fill: "url(#bodyGradient)",
    stroke: "#333",
    "stroke-width": "4",
    filter: "url(#dropShadow)",
  });
  svg.appendChild(leftHandle);

  // 左侧手柄高光
  const leftHighlight = Blockly.utils.createSvgElement("ellipse", {
    cx: "75",
    cy: "105",
    rx: "25",
    ry: "20",
    fill: "#ffffff",
    opacity: "0.3",
  });
  svg.appendChild(leftHighlight);

  // 右侧圆形手柄 - 阴影层
  const rightHandleShadow = Blockly.utils.createSvgElement("circle", {
    cx: "362",
    cy: "128",
    r: "70",
    fill: "#000000",
    opacity: "0.15",
  });
  svg.appendChild(rightHandleShadow);

  // 右侧圆形手柄 - 主体
  const rightHandle = Blockly.utils.createSvgElement("circle", {
    cx: "360",
    cy: "125",
    r: "70",
    fill: "url(#bodyGradient)",
    stroke: "#333",
    "stroke-width": "4",
    filter: "url(#dropShadow)",
  });
  svg.appendChild(rightHandle);

  // 右侧手柄高光
  const rightHighlight = Blockly.utils.createSvgElement("ellipse", {
    cx: "345",
    cy: "105",
    rx: "25",
    ry: "20",
    fill: "#ffffff",
    opacity: "0.3",
  });
  svg.appendChild(rightHighlight);

  // =================== L/R 肩键 ===================

  const shoulderButtons = [
    { x: 90, y: 36, label: "L", value: "L" },
    { x: 310, y: 36, label: "R", value: "R" },
  ];

  shoulderButtons.forEach(
    function (btn) {
      const btnGroup = Blockly.utils.createSvgElement("g", {
        class: "shoulder-button",
        style: "cursor: pointer;",
      });

      // 肩键阴影
      const rectShadow = Blockly.utils.createSvgElement("rect", {
        x: btn.x + 1,
        y: btn.y + 2,
        width: "60",
        height: "17",
        rx: "3",
        fill: "#000000",
        opacity: "0.2",
      });
      btnGroup.appendChild(rectShadow);

      // 肩键主体
      const rect = Blockly.utils.createSvgElement("rect", {
        x: btn.x,
        y: btn.y,
        width: "60",
        height: "17",
        rx: "3",
        fill: this.handShankValue_ === btn.value ? "#4CAF50" : "#f0f0f0",
        stroke: "#333",
        "stroke-width": "2",
        filter: "url(#dropShadow)",
      });

      // 肩键高光
      const rectHighlight = Blockly.utils.createSvgElement("rect", {
        x: btn.x + 5,
        y: btn.y + 3,
        width: "50",
        height: "5",
        rx: "2",
        fill: "#ffffff",
        opacity: "0.4",
      });
      btnGroup.appendChild(rectHighlight);

      const text = Blockly.utils.createSvgElement("text", {
        x: btn.x + 30,
        y: btn.y + 13,
        "text-anchor": "middle",
        "font-size": "14",
        "font-weight": "bold",
        fill: this.handShankValue_ === btn.value ? "#fff" : "#333",
      });
      text.textContent = btn.label;

      btnGroup.appendChild(rect);
      btnGroup.appendChild(text);

      // 点击事件 - 添加按压效果
      btnGroup.onclick = function (value, rectElem, textElem, group) {
        return function () {
          // 按下效果
          rectElem.setAttribute("y", btn.y + 2);
          textElem.setAttribute("y", btn.y + 15);

          setTimeout(
            function () {
              rectElem.setAttribute("y", btn.y);
              textElem.setAttribute("y", btn.y + 13);
              this.setValue(value);
              Blockly.DropDownDiv.hide();
            }.bind(this),
            100
          );
        }.bind(this);
      }.bind(this)(btn.value, rect, text, btnGroup);

      // 悬停效果
      btnGroup.onmouseenter = function () {
        rect.setAttribute("fill", "#2196F3");
        text.setAttribute("fill", "#fff");
      };

      btnGroup.onmouseleave = function (value, rectElem, textElem) {
        return function () {
          const isSelected = this.handShankValue_ === value;
          rectElem.setAttribute("fill", isSelected ? "#4CAF50" : "#f0f0f0");
          textElem.setAttribute("fill", isSelected ? "#fff" : "#333");
        }.bind(this);
      }.bind(this)(btn.value, rect, text);

      svg.appendChild(btnGroup);
    }.bind(this)
  );

  // =================== 左侧方向键（十字键）===================

  // 十字键背景圆 - 阴影
  const dpadBgShadow = Blockly.utils.createSvgElement("circle", {
    cx: "92",
    cy: "127",
    r: "40",
    fill: "#000000",
    opacity: "0.2",
  });
  svg.appendChild(dpadBgShadow);

  // 十字键背景圆 - 主体
  const dpadBg = Blockly.utils.createSvgElement("circle", {
    cx: "90",
    cy: "125",
    r: "40",
    fill: "#2c2c2c",
    stroke: "#1a1a1a",
    "stroke-width": "2",
  });
  svg.appendChild(dpadBg);

  // 十字键背景高光
  const dpadBgHighlight = Blockly.utils.createSvgElement("circle", {
    cx: "85",
    cy: "115",
    r: "15",
    fill: "#ffffff",
    opacity: "0.15",
  });
  svg.appendChild(dpadBgHighlight);

  // =================== 十字键配置（使用独立 Path）===================
  const dpadButtons = [
    {
      name: "up",
      value: "up",
      path: "M 78 95 L 101 95 L 101 113 L 90 122 L 78 113 Z",
    },
    {
      name: "down",
      value: "down",
      path: "M 78 150 L 101 150 L 101 132 L 90 122 L 78 132 Z",
    },
    {
      name: "left",
      value: "left",
      path: "M 60 113 L 60 132 L 78 132 L 90 122 L 78 113 Z",
    },
    {
      name: "right",
      value: "right",
      path: "M 119 112 L 119 132 L 101 132 L 90 122 L 101 113 Z",
    },
  ];

  // 创建每个方向键并添加交互效果
  dpadButtons.forEach(
    function (btn) {
      // 创建 <g> 包裹每个方向键
      const group = Blockly.utils.createSvgElement("g", {
        style: "cursor: pointer;",
      });

      // 十字键阴影层
      const pathShadow = Blockly.utils.createSvgElement("path", {
        d: btn.path,
        fill: "#000000",
        opacity: "0.3",
        transform: "translate(1, 2)",
      });
      group.appendChild(pathShadow);

      // 十字键主体
      const pathElem = Blockly.utils.createSvgElement("path", {
        d: btn.path,
        fill: this.handShankValue_ === btn.value ? "#4CAF50" : "#555",
        stroke: "#222",
        "stroke-width": "2",
        "stroke-linejoin": "round",
        style: "transition: fill 0.2s, stroke-width 0.2s;",
        filter: "url(#dropShadow)",
      });
      group.appendChild(pathElem);

      // 点击事件 - 设置值并关闭下拉菜单
      group.onclick = function (value, path, g) {
        return function () {
          // 添加点击动画 - 缩放效果
          g.setAttribute("transform", "scale(0.9)");
          g.style.transformOrigin = "center";

          setTimeout(
            function () {
              g.setAttribute("transform", "");
              this.setValue(value);
              Blockly.DropDownDiv.hide();
            }.bind(this),
            150
          );
        }.bind(this);
      }.bind(this)(btn.value, pathElem, group);

      // 悬停效果
      group.onmouseenter = function () {
        pathElem.setAttribute("fill", "#2196F3");
        pathElem.setAttribute("stroke-width", "3");
      };

      group.onmouseleave = function (value, path) {
        return function () {
          const isSelected = this.handShankValue_ === value;
          path.setAttribute("fill", isSelected ? "#4CAF50" : "#555");
          path.setAttribute("stroke-width", "2");
        }.bind(this);
      }.bind(this)(btn.value, pathElem);

      svg.appendChild(group);
    }.bind(this)
  );

  // 中心圆圈装饰 - 阴影
  const centerCircleShadow = Blockly.utils.createSvgElement("circle", {
    cx: "91",
    cy: "123",
    r: "6",
    fill: "#000000",
    opacity: "0.4",
  });
  svg.appendChild(centerCircleShadow);

  // 中心圆圈装饰 - 主体
  const centerCircle = Blockly.utils.createSvgElement("circle", {
    cx: "90",
    cy: "122",
    r: "6",
    fill: "#888",
    stroke: "#333",
    "stroke-width": "2",
  });
  svg.appendChild(centerCircle);

  // 中心圆圈高光
  const centerHighlight = Blockly.utils.createSvgElement("circle", {
    cx: "88",
    cy: "120",
    r: "2",
    fill: "#ffffff",
    opacity: "0.6",
  });
  svg.appendChild(centerHighlight);

  // =================== 中间装饰（两个短线）===================

  const decorLine1 = Blockly.utils.createSvgElement("line", {
    x1: "190",
    y1: "115",
    x2: "210",
    y2: "135",
    stroke: "#999",
    "stroke-width": "4",
    "stroke-linecap": "round",
  });
  svg.appendChild(decorLine1);

  const decorLine2 = Blockly.utils.createSvgElement("line", {
    x1: "240",
    y1: "115",
    x2: "260",
    y2: "135",
    stroke: "#999",
    "stroke-width": "4",
    "stroke-linecap": "round",
  });
  svg.appendChild(decorLine2);

  // =================== 右侧按钮（A/B/X/Y 风格的 4 个按钮）===================

  // 按钮配置：对应手柄的 YABX 按钮
  const rightButtons = [
    { x: 360, y: 95, label: "Y", value: "Y" }, // 上
    { x: 390, y: 125, label: "B", value: "B" }, // 右
    { x: 360, y: 155, label: "A", value: "A" }, // 下
    { x: 330, y: 125, label: "X", value: "X" }, // 左
  ];

  rightButtons.forEach(
    function (btn) {
      const btnGroup = Blockly.utils.createSvgElement("g", {
        class: "handshank-button",
        style: "cursor: pointer;",
      });

      // 按钮阴影
      const circleShadow = Blockly.utils.createSvgElement("circle", {
        cx: btn.x + 2,
        cy: btn.y + 3,
        r: "18",
        fill: "#000000",
        opacity: "0.3",
      });
      btnGroup.appendChild(circleShadow);

      // 按钮圆形
      const circle = Blockly.utils.createSvgElement("circle", {
        cx: btn.x,
        cy: btn.y,
        r: "18",
        fill:
          this.handShankValue_ === btn.value
            ? "#4CAF50"
            : "url(#buttonGradient)",
        stroke: "#333",
        "stroke-width": "3",
        filter: "url(#dropShadow)",
      });

      // 按钮高光
      const circleHighlight = Blockly.utils.createSvgElement("ellipse", {
        cx: btn.x - 4,
        cy: btn.y - 4,
        rx: "6",
        ry: "8",
        fill: "#ffffff",
        opacity: "0.5",
      });
      btnGroup.appendChild(circleHighlight);

      // 按钮文字
      const text = Blockly.utils.createSvgElement("text", {
        x: btn.x,
        y: btn.y + 5,
        "text-anchor": "middle",
        "font-size": "14",
        "font-weight": "bold",
        fill: this.handShankValue_ === btn.value ? "#fff" : "#333",
        style: "text-shadow: 0 1px 2px rgba(0,0,0,0.3);",
      });
      text.textContent = btn.label;

      btnGroup.appendChild(circle);
      btnGroup.appendChild(text);

      // 点击事件 - 添加缩放动画
      btnGroup.onclick = function (value, circleElem, textElem, group) {
        return function () {
          // 点击动画：缩小再恢复
          const originalR = circleElem.getAttribute("r");
          circleElem.setAttribute("r", parseFloat(originalR) * 0.85);

          setTimeout(
            function () {
              circleElem.setAttribute("r", originalR);
              this.setValue(value);
              Blockly.DropDownDiv.hide();
            }.bind(this),
            150
          );
        }.bind(this);
      }.bind(this)(btn.value, circle, text, btnGroup);

      // 悬停效果 - 发光和放大
      btnGroup.onmouseenter = function () {
        circle.setAttribute("fill", "#2196F3");
        circle.setAttribute("r", "20");
        circle.setAttribute("stroke-width", "4");
        circle.style.filter = "url(#dropShadow) drop-shadow(0 0 8px #2196F3)";
        text.setAttribute("fill", "#fff");
      };

      btnGroup.onmouseleave = function (value, circleElem, textElem) {
        return function () {
          const isSelected = this.handShankValue_ === value;
          circleElem.setAttribute(
            "fill",
            isSelected ? "#4CAF50" : "url(#buttonGradient)"
          );
          circleElem.setAttribute("r", "18");
          circleElem.setAttribute("stroke-width", "3");
          circleElem.style.filter = "url(#dropShadow)";
          textElem.setAttribute("fill", isSelected ? "#fff" : "#333");
        }.bind(this);
      }.bind(this)(btn.value, circle, text);

      svg.appendChild(btnGroup);
    }.bind(this)
  );

  div.appendChild(svg);
  return div;
};

// ============= 9. 注册字段类型 =============
Blockly.Field.register("field_handShank", Blockly.FieldHandShank);
