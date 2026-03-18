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
    "background: #2a2a3e;" +
      "padding: 16px;" +
      "border-radius: 14px;" +
      "box-shadow: 0 10px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);" +
      "display: inline-block;"
  );

  // 创建 SVG 画布
  const svg = Blockly.utils.createSvgElement("svg", {
    width: "460",
    height: "220",
    viewBox: "0 0 460 220",
  });

  // =================== 定义渐变和滤镜 ===================
  const defs = Blockly.utils.createSvgElement("defs", {});

  // 手柄主体渐变（浅灰色，模拟真实手柄）
  const bodyGrad = Blockly.utils.createSvgElement("linearGradient", {
    id: "hs_bodyGrad",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  });
  [
    ["0%", "#e8e8e8"],
    ["40%", "#d0d0d0"],
    ["100%", "#b8b8b8"],
  ].forEach(function (s) {
    var st = Blockly.utils.createSvgElement("stop", {
      offset: s[0],
      style: "stop-color:" + s[1] + ";stop-opacity:1",
    });
    bodyGrad.appendChild(st);
  });
  defs.appendChild(bodyGrad);

  // 手柄侧面深色渐变
  const bodySideGrad = Blockly.utils.createSvgElement("linearGradient", {
    id: "hs_bodySideGrad",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  });
  [
    ["0%", "#c0c0c0"],
    ["100%", "#909090"],
  ].forEach(function (s) {
    var st = Blockly.utils.createSvgElement("stop", {
      offset: s[0],
      style: "stop-color:" + s[1] + ";stop-opacity:1",
    });
    bodySideGrad.appendChild(st);
  });
  defs.appendChild(bodySideGrad);

  // 肩键渐变
  const shoulderGrad = Blockly.utils.createSvgElement("linearGradient", {
    id: "hs_shoulderGrad",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  });
  [
    ["0%", "#d8d8d8"],
    ["100%", "#a8a8a8"],
  ].forEach(function (s) {
    var st = Blockly.utils.createSvgElement("stop", {
      offset: s[0],
      style: "stop-color:" + s[1] + ";stop-opacity:1",
    });
    shoulderGrad.appendChild(st);
  });
  defs.appendChild(shoulderGrad);

  // 选中蓝色渐变
  const selGrad = Blockly.utils.createSvgElement("radialGradient", {
    id: "hs_selGrad",
    cx: "35%",
    cy: "35%",
    r: "65%",
  });
  [
    ["0%", "#64b5f6"],
    ["100%", "#1565c0"],
  ].forEach(function (s) {
    var st = Blockly.utils.createSvgElement("stop", {
      offset: s[0],
      style: "stop-color:" + s[1] + ";stop-opacity:1",
    });
    selGrad.appendChild(st);
  });
  defs.appendChild(selGrad);

  // hover蓝色渐变
  const hoverGrad = Blockly.utils.createSvgElement("radialGradient", {
    id: "hs_hoverGrad",
    cx: "35%",
    cy: "35%",
    r: "65%",
  });
  [
    ["0%", "#90caf9"],
    ["100%", "#1976d2"],
  ].forEach(function (s) {
    var st = Blockly.utils.createSvgElement("stop", {
      offset: s[0],
      style: "stop-color:" + s[1] + ";stop-opacity:1",
    });
    hoverGrad.appendChild(st);
  });
  defs.appendChild(hoverGrad);

  // 右侧按钮彩色渐变
  var colorDefs = [
    { id: "hs_redGrad", c1: "#ef9a9a", c2: "#c62828" },
    { id: "hs_blueGrad", c1: "#90caf9", c2: "#1565c0" },
    { id: "hs_greenGrad", c1: "#a5d6a7", c2: "#2e7d32" },
    { id: "hs_yellowGrad", c1: "#fff59d", c2: "#f57f17" },
  ];
  colorDefs.forEach(function (cd) {
    var rg = Blockly.utils.createSvgElement("radialGradient", {
      id: cd.id,
      cx: "35%",
      cy: "35%",
      r: "65%",
    });
    [
      ["0%", cd.c1],
      ["100%", cd.c2],
    ].forEach(function (s) {
      var st = Blockly.utils.createSvgElement("stop", {
        offset: s[0],
        style: "stop-color:" + s[1] + ";stop-opacity:1",
      });
      rg.appendChild(st);
    });
    defs.appendChild(rg);
  });

  // 十字键背景渐变
  const dpadGrad = Blockly.utils.createSvgElement("radialGradient", {
    id: "hs_dpadGrad",
    cx: "40%",
    cy: "35%",
    r: "70%",
  });
  [
    ["0%", "#4a4a4a"],
    ["100%", "#1a1a1a"],
  ].forEach(function (s) {
    var st = Blockly.utils.createSvgElement("stop", {
      offset: s[0],
      style: "stop-color:" + s[1] + ";stop-opacity:1",
    });
    dpadGrad.appendChild(st);
  });
  defs.appendChild(dpadGrad);

  // 阴影滤镜
  var shadowFilter = Blockly.utils.createSvgElement("filter", {
    id: "hs_shadow",
    x: "-30%",
    y: "-30%",
    width: "160%",
    height: "160%",
  });
  var fgb = Blockly.utils.createSvgElement("feGaussianBlur", {
    in: "SourceAlpha",
    stdDeviation: "2.5",
  });
  var foff = Blockly.utils.createSvgElement("feOffset", {
    dx: "1",
    dy: "2",
    result: "blur",
  });
  var ffl = Blockly.utils.createSvgElement("feFlood", {
    "flood-color": "#000",
    "flood-opacity": "0.35",
  });
  var fco = Blockly.utils.createSvgElement("feComposite", {
    in2: "blur",
    operator: "in",
  });
  var fmg = Blockly.utils.createSvgElement("feMerge", {});
  fmg.appendChild(Blockly.utils.createSvgElement("feMergeNode", {}));
  fmg.appendChild(
    Blockly.utils.createSvgElement("feMergeNode", { in: "SourceGraphic" })
  );
  shadowFilter.appendChild(fgb);
  shadowFilter.appendChild(foff);
  shadowFilter.appendChild(ffl);
  shadowFilter.appendChild(fco);
  shadowFilter.appendChild(fmg);
  defs.appendChild(shadowFilter);

  // 发光滤镜（选中/悬浮时）
  var glowFilter = Blockly.utils.createSvgElement("filter", {
    id: "hs_glow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
  });
  var fgbGlow = Blockly.utils.createSvgElement("feGaussianBlur", {
    in: "SourceGraphic",
    stdDeviation: "3",
    result: "blur",
  });
  var fmgGlow = Blockly.utils.createSvgElement("feMerge", {});
  fmgGlow.appendChild(
    Blockly.utils.createSvgElement("feMergeNode", { in: "blur" })
  );
  fmgGlow.appendChild(
    Blockly.utils.createSvgElement("feMergeNode", { in: "SourceGraphic" })
  );
  glowFilter.appendChild(fgbGlow);
  glowFilter.appendChild(fmgGlow);
  defs.appendChild(glowFilter);

  svg.appendChild(defs);

  // =================== 手柄主体（真实SNES轮廓 path）===================
  // 左右圆形握把 + 中间平板连接，使用 path 绘制流线型外形
  // 整体居中于 460x220，手柄中心约 (230, 118)

  // 手柄主体阴影（已按画布尺寸换算坐标，不再使用 transform）
  var bodyShadow = Blockly.utils.createSvgElement("path", {
    d: "M 121 174 A 72 72 0 1 1 72 45 L 369 45 A 72 72 0 1 1 323 174 L 121 174 Z",
    fill: "#000",
    opacity: "0.25",
  });
  svg.appendChild(bodyShadow);

  // 手柄主体（与阴影同样坐标系）
  var bodyPath = Blockly.utils.createSvgElement("path", {
    d: "M 121 174 A 72 72 0 1 1 72 45 L 369 45 A 72 72 0 1 1 323 174 L 121 174 Z",
    fill: "url(#hs_bodyGrad)",
    stroke: "#888",
    "stroke-width": "2",
    filter: "url(#hs_shadow)",
  });
  svg.appendChild(bodyPath);

  // 手柄顶部边缘高光条
  var bodyHighlight = Blockly.utils.createSvgElement("path", {
    d: "M 108 52 C 120 50, 134 48, 148 48 L 314 48 C 328 48, 342 50, 354 52",
    fill: "none",
    stroke: "#fff",
    "stroke-width": "3",
    opacity: "0.4",
    "stroke-linecap": "round",
  });
  svg.appendChild(bodyHighlight);

  // 左侧握把高光椭圆
  var leftGlow = Blockly.utils.createSvgElement("ellipse", {
    cx: "52",
    cy: "95",
    rx: "22",
    ry: "18",
    fill: "#fff",
    opacity: "0.18",
  });
  svg.appendChild(leftGlow);

  // 右侧握把高光椭圆
  var rightGlow = Blockly.utils.createSvgElement("ellipse", {
    cx: "408",
    cy: "95",
    rx: "22",
    ry: "18",
    fill: "#fff",
    opacity: "0.18",
  });
  svg.appendChild(rightGlow);

  // =================== 顶部肩键 L1/R1（紧贴圆弧区域，不延伸到中间）===================
  // 手柄左圆弧圆心约 (72+72, 45) = (144, 45-72)=(144,-27)，右圆弧圆心约(369-72,47-72)
  // L1 覆盖左圆弧上半部分，R1 覆盖右圆弧上半部分
  var shoulderButtons = [
    {
      value: "L1",
      label: "L1",
      path: "M 33 46 A 72 72 0 0 1 73 33 L 117 33 Q 122 39 117 45 L 72 45 A 72 72 0 0 0 33 60 Z",
    },
    {
      value: "R1",
      label: "R1",
      path: "M 411 46 A 72 72 0 0 0 369 33 L 322 33 Q 317 39 322 45 L 369 45 A 72 72 0 0 1 411 60 Z",
    },
  ];

  shoulderButtons.forEach(
    function (btn) {
      var g = Blockly.utils.createSvgElement("g", { style: "cursor:pointer;" });
      var isSelected = this.handShankValue_ === btn.value;

      var shadow = Blockly.utils.createSvgElement("path", {
        d: btn.path,
        fill: "#000",
        opacity: "0.2",
        transform: "translate(1,2)",
      });
      g.appendChild(shadow);

      var shape = Blockly.utils.createSvgElement("path", {
        d: btn.path,
        fill: isSelected ? "url(#hs_selGrad)" : "url(#hs_shoulderGrad)",
        stroke: isSelected ? "#1565c0" : "#888",
        "stroke-width": isSelected ? "2" : "1.5",
        "stroke-linejoin": "round",
        filter: isSelected ? "url(#hs_glow)" : "url(#hs_shadow)",
      });

      var isLeft = btn.label.indexOf("L") === 0;
      // 文字居中在各自圆弧区域：L1 约 x=78，R1 约 x=372
      var tx = isLeft ? 78 : 372;
      var ty = 43;

      var txt = Blockly.utils.createSvgElement("text", {
        x: tx,
        y: ty,
        "text-anchor": "middle",
        "font-size": "11",
        "font-weight": "bold",
        fill: isSelected ? "#fff" : "#555",
      });
      txt.textContent = btn.label;

      g.appendChild(shape);
      g.appendChild(txt);

      g.onmouseenter = function () {
        shape.setAttribute("fill", "url(#hs_hoverGrad)");
        shape.setAttribute("stroke", "#1976d2");
        txt.setAttribute("fill", "#fff");
      };
      g.onmouseleave = function (v, s, t) {
        return function () {
          var sel = this.handShankValue_ === v;
          s.setAttribute(
            "fill",
            sel ? "url(#hs_selGrad)" : "url(#hs_shoulderGrad)"
          );
          s.setAttribute("stroke", sel ? "#1565c0" : "#888");
          t.setAttribute("fill", sel ? "#fff" : "#555");
        }.bind(this);
      }.bind(this)(btn.value, shape, txt);

      g.onclick = function (v) {
        return function () {
          this.setValue(v);
          Blockly.DropDownDiv.hide();
        }.bind(this);
      }.bind(this)(btn.value);

      svg.appendChild(g);
    }.bind(this)
  );

  // =================== 十字方向键（标准十字形）===================
  // 中心坐标 (85, 115)，十字臂宽16，臂长28（整体稍向左偏一些）
  var cx = 85,
    cy = 115,
    aw = 16,
    al = 28;
  var dpadCrossPath =
    "M " +
    (cx - aw / 2) +
    " " +
    (cy - al - aw / 2) +
    " L " +
    (cx + aw / 2) +
    " " +
    (cy - al - aw / 2) +
    " L " +
    (cx + aw / 2) +
    " " +
    (cy - aw / 2) +
    " L " +
    (cx + al + aw / 2) +
    " " +
    (cy - aw / 2) +
    " L " +
    (cx + al + aw / 2) +
    " " +
    (cy + aw / 2) +
    " L " +
    (cx + aw / 2) +
    " " +
    (cy + aw / 2) +
    " L " +
    (cx + aw / 2) +
    " " +
    (cy + al + aw / 2) +
    " L " +
    (cx - aw / 2) +
    " " +
    (cy + al + aw / 2) +
    " L " +
    (cx - aw / 2) +
    " " +
    (cy + aw / 2) +
    " L " +
    (cx - al - aw / 2) +
    " " +
    (cy + aw / 2) +
    " L " +
    (cx - al - aw / 2) +
    " " +
    (cy - aw / 2) +
    " L " +
    (cx - aw / 2) +
    " " +
    (cy - aw / 2) +
    " Z";

  // 十字键底部阴影
  var dpadShadow = Blockly.utils.createSvgElement("path", {
    d: dpadCrossPath,
    fill: "#000",
    opacity: "0.35",
    transform: "translate(1.5, 2.5)",
  });
  svg.appendChild(dpadShadow);

  // 十字键主体背景
  var dpadBase = Blockly.utils.createSvgElement("path", {
    d: dpadCrossPath,
    fill: "url(#hs_dpadGrad)",
    stroke: "#111",
    "stroke-width": "1.5",
    "stroke-linejoin": "round",
  });
  svg.appendChild(dpadBase);

  // 四个方向区域（可点击，带高亮）
  var dpadButtons = [
    {
      value: "up",
      label: "▲",
      path:
        "M " +
        (cx - aw / 2 + 2) +
        " " +
        (cy - al - aw / 2 + 2) +
        " L " +
        (cx + aw / 2 - 2) +
        " " +
        (cy - al - aw / 2 + 2) +
        " L " +
        (cx + aw / 2 - 2) +
        " " +
        (cy - aw / 2 - 1) +
        " L " +
        (cx - aw / 2 + 2) +
        " " +
        (cy - aw / 2 - 1) +
        " Z",
      arrowX: cx,
      arrowY: cy - al + 2,
    },
    {
      value: "down",
      label: "▼",
      path:
        "M " +
        (cx - aw / 2 + 2) +
        " " +
        (cy + aw / 2 + 1) +
        " L " +
        (cx + aw / 2 - 2) +
        " " +
        (cy + aw / 2 + 1) +
        " L " +
        (cx + aw / 2 - 2) +
        " " +
        (cy + al + aw / 2 - 2) +
        " L " +
        (cx - aw / 2 + 2) +
        " " +
        (cy + al + aw / 2 - 2) +
        " Z",
      arrowX: cx,
      arrowY: cy + al - 1,
    },
    {
      value: "left",
      label: "◀",
      path:
        "M " +
        (cx - al - aw / 2 + 2) +
        " " +
        (cy - aw / 2 + 2) +
        " L " +
        (cx - aw / 2 - 1) +
        " " +
        (cy - aw / 2 + 2) +
        " L " +
        (cx - aw / 2 - 1) +
        " " +
        (cy + aw / 2 - 2) +
        " L " +
        (cx - al - aw / 2 + 2) +
        " " +
        (cy + aw / 2 - 2) +
        " Z",
      arrowX: cx - al + 2,
      arrowY: cy + 4,
    },
    {
      value: "right",
      label: "▶",
      path:
        "M " +
        (cx + aw / 2 + 1) +
        " " +
        (cy - aw / 2 + 2) +
        " L " +
        (cx + al + aw / 2 - 2) +
        " " +
        (cy - aw / 2 + 2) +
        " L " +
        (cx + al + aw / 2 - 2) +
        " " +
        (cy + aw / 2 - 2) +
        " L " +
        (cx + aw / 2 + 1) +
        " " +
        (cy + aw / 2 - 2) +
        " Z",
      arrowX: cx + al - 1,
      arrowY: cy + 4,
    },
  ];

  dpadButtons.forEach(
    function (btn) {
      var g = Blockly.utils.createSvgElement("g", { style: "cursor:pointer;" });
      var isSelected = this.handShankValue_ === btn.value;

      var area = Blockly.utils.createSvgElement("path", {
        d: btn.path,
        fill: isSelected ? "url(#hs_selGrad)" : "rgba(255,255,255,0.05)",
        rx: "2",
      });

      var arrow = Blockly.utils.createSvgElement("text", {
        x: btn.arrowX,
        y: btn.arrowY,
        "text-anchor": "middle",
        "font-size": "11",
        fill: isSelected ? "#90caf9" : "#888",
        "font-weight": "bold",
      });
      arrow.textContent = btn.label;

      g.appendChild(area);
      g.appendChild(arrow);

      g.onmouseenter = function () {
        area.setAttribute("fill", "url(#hs_hoverGrad)");
        arrow.setAttribute("fill", "#fff");
      };
      g.onmouseleave = function (v, a, ar) {
        return function () {
          var sel = this.handShankValue_ === v;
          a.setAttribute(
            "fill",
            sel ? "url(#hs_selGrad)" : "rgba(255,255,255,0.05)"
          );
          ar.setAttribute("fill", sel ? "#90caf9" : "#888");
        }.bind(this);
      }.bind(this)(btn.value, area, arrow);

      g.onclick = function (v) {
        return function () {
          this.setValue(v);
          Blockly.DropDownDiv.hide();
        }.bind(this);
      }.bind(this)(btn.value);

      svg.appendChild(g);
    }.bind(this)
  );

  // 十字键中心装饰圆
  var dpadCenter = Blockly.utils.createSvgElement("circle", {
    cx: cx,
    cy: cy,
    r: "6",
    fill: "#333",
    stroke: "#111",
    "stroke-width": "1",
  });
  svg.appendChild(dpadCenter);
  var dpadCenterHL = Blockly.utils.createSvgElement("circle", {
    cx: cx - 2,
    cy: cy - 2,
    r: "2",
    fill: "#fff",
    opacity: "0.3",
  });
  svg.appendChild(dpadCenterHL);

  // =================== 中间 SELECT / START 按键（椭圆形）===================
  // x 坐标略向中间收拢，让 SELECT / START 更靠近手柄中心
  var midButtons = [
    { value: "select", label: "SELECT", x: 195, y: 135 },
    { value: "start", label: "START", x: 265, y: 135 },
  ];

  midButtons.forEach(
    function (btn) {
      var g = Blockly.utils.createSvgElement("g", { style: "cursor:pointer;" });
      var isSelected = this.handShankValue_ === btn.value;

      var shadow = Blockly.utils.createSvgElement("ellipse", {
        cx: btn.x + 1,
        cy: btn.y + 2,
        rx: "22",
        ry: "10",
        fill: "#000",
        opacity: "0.3",
      });
      g.appendChild(shadow);

      var ellipse = Blockly.utils.createSvgElement("ellipse", {
        cx: btn.x,
        cy: btn.y,
        rx: "22",
        ry: "10",
        fill: isSelected ? "url(#hs_selGrad)" : "#555",
        stroke: isSelected ? "#1565c0" : "#333",
        "stroke-width": isSelected ? "2" : "1.5",
        filter: isSelected ? "url(#hs_glow)" : "url(#hs_shadow)",
      });

      var highlight = Blockly.utils.createSvgElement("ellipse", {
        cx: btn.x - 4,
        cy: btn.y - 3,
        rx: "8",
        ry: "3",
        fill: "#fff",
        opacity: "0.2",
      });

      var txt = Blockly.utils.createSvgElement("text", {
        x: btn.x,
        y: btn.y + 4,
        "text-anchor": "middle",
        "font-size": "8",
        "font-weight": "bold",
        fill: isSelected ? "#fff" : "#bbb",
        "letter-spacing": "0.5",
      });
      txt.textContent = btn.label;

      g.appendChild(ellipse);
      g.appendChild(highlight);
      g.appendChild(txt);

      g.onmouseenter = function () {
        ellipse.setAttribute("fill", "url(#hs_hoverGrad)");
        ellipse.setAttribute("stroke", "#1976d2");
        txt.setAttribute("fill", "#fff");
      };
      g.onmouseleave = function (v, el, t) {
        return function () {
          var sel = this.handShankValue_ === v;
          el.setAttribute("fill", sel ? "url(#hs_selGrad)" : "#555");
          el.setAttribute("stroke", sel ? "#1565c0" : "#333");
          t.setAttribute("fill", sel ? "#fff" : "#bbb");
        }.bind(this);
      }.bind(this)(btn.value, ellipse, txt);

      // g.onclick = function (v) {
      //   return function () {
      //     this.setValue(v);
      //     Blockly.DropDownDiv.hide();
      //   }.bind(this);
      // }.bind(this)(btn.value);

      svg.appendChild(g);
    }.bind(this)
  );

  // =================== 右侧 ABXY 彩色按键 ===================
  // 对应图片：上=红(Y), 右=蓝(X), 下=黄(A), 左=绿(B)
  var rightButtons = [
    {
      value: "Y",
      label: "Y",
      x: 365,
      y: 88,
      color: "hs_redGrad",
      selColor: "#c62828",
    },
    {
      value: "X",
      label: "X",
      x: 400,
      y: 115,
      color: "hs_blueGrad",
      selColor: "#1565c0",
    },
    {
      value: "A",
      label: "A",
      x: 365,
      y: 142,
      color: "hs_yellowGrad",
      selColor: "#f57f17",
    },
    {
      value: "B",
      label: "B",
      x: 330,
      y: 115,
      color: "hs_greenGrad",
      selColor: "#2e7d32",
    },
  ];

  rightButtons.forEach(
    function (btn) {
      var g = Blockly.utils.createSvgElement("g", { style: "cursor:pointer;" });
      var isSelected = this.handShankValue_ === btn.value;

      // 按钮阴影
      var shadow = Blockly.utils.createSvgElement("circle", {
        cx: btn.x + 2,
        cy: btn.y + 3,
        r: "17",
        fill: "#000",
        opacity: "0.35",
      });
      g.appendChild(shadow);

      // 按钮主体
      var circle = Blockly.utils.createSvgElement("circle", {
        cx: btn.x,
        cy: btn.y,
        r: "17",
        fill: "url(#" + btn.color + ")",
        stroke: isSelected ? btn.selColor : "#333",
        "stroke-width": isSelected ? "3" : "1.5",
        filter: isSelected ? "url(#hs_glow)" : "url(#hs_shadow)",
      });

      // 高光
      var hl = Blockly.utils.createSvgElement("ellipse", {
        cx: btn.x - 4,
        cy: btn.y - 5,
        rx: "6",
        ry: "5",
        fill: "#fff",
        opacity: "0.45",
      });

      // 文字
      var txt = Blockly.utils.createSvgElement("text", {
        x: btn.x,
        y: btn.y + 5,
        "text-anchor": "middle",
        "font-size": "13",
        "font-weight": "bold",
        fill: "#fff",
        style: "text-shadow: 0 1px 3px rgba(0,0,0,0.5);",
      });
      txt.textContent = btn.label;

      g.appendChild(circle);
      g.appendChild(hl);
      g.appendChild(txt);

      g.onmouseenter = function () {
        circle.setAttribute("r", "19");
        circle.setAttribute("stroke", btn.selColor);
        circle.setAttribute("stroke-width", "3");
      };
      g.onmouseleave = function (v, c) {
        return function () {
          var sel = this.handShankValue_ === v;
          c.setAttribute("r", "17");
          c.setAttribute("fill", "url(#" + btn.color + ")");
          c.setAttribute("stroke", sel ? btn.selColor : "#333");
          c.setAttribute("stroke-width", sel ? "3" : "1.5");
        }.bind(this);
      }.bind(this)(btn.value, circle);

      g.onclick = function (v) {
        return function () {
          this.setValue(v);
          Blockly.DropDownDiv.hide();
        }.bind(this);
      }.bind(this)(btn.value);

      svg.appendChild(g);
    }.bind(this)
  );

  div.appendChild(svg);
  return div;
};

// ============= 9. 注册字段类型 =============
Blockly.Field.register("field_handShank", Blockly.FieldHandShank);
