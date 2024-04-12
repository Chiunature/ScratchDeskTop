/**
 * Visual Blocks Language
 *
 * Copyright 2021 openblock.cc.
 * https://github.com/openblockcc/openblock-blocks
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
'use strict';

goog.provide('Blockly.cake.matrix');

goog.require('Blockly.cake');


Blockly.cake['matrix'] = function (block) {
    // Numeric value.
    var code = block.getFieldValue('MATRIX');
    if (isNaN(code)) {
        code = 0;
    }
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['matrix_lamp'] = function (block) {
    let lamp = block.getFieldValue('lamp');
    let no, id = block.id, blockDB_ = block.workspace.blockDB_;
    Object.keys(blockDB_).map((el, index) => {
        if (el == id) {
            if (index > 0) no = index - 1;
            else no = index;
        }
    });
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    let lp = Blockly.cake.stringToHex(lamp);
    let newColor;
    if (typeof color === 'string' && color.indexOf('(') === -1 && color.indexOf('#') !== -1) {
        const pre = Blockly.cake.hexToRgb(color);
        // const target = Blockly.cake.rgbToGrb(pre);
        const last = Blockly.cake.grbToHex(pre);
        if (!last) {
            return;
        }
        newColor = last.replace(/\'/g, '');
        newColor = parseInt(newColor).toString();
    } else {
        newColor = color;
    }

    // TODO: Assemble cake into code variable.
    let code = `char BMP${no}[] = {${lp}};\nmatrix_lamp(NULL, BMP${no}, ${Blockly.cake.toStr(newColor) ? newColor : '"' + newColor + '"'});\n`;
    return code;
};

Blockly.cake['matrix_lamp_stop'] = function (block) {
    // TODO: Assemble cake into code variable.
    let code = `matrix_clearAll();\n`;
    return code;
};

Blockly.cake['matrix_lamp_set'] = function (block) {
    let brightness = Blockly.cake.valueToCode(block, "brightness", Blockly.cake.ORDER_NONE);
    if (brightness.indexOf('(') === -1 && !isNaN(brightness / 10)) {
        brightness = parseInt(brightness / 10) + '';
    }
    // TODO: Assemble cake into code variable.
    let code = `matrix_set_lamp(NULL, ${Blockly.cake.toStr(brightness) ? brightness : '"' + brightness + '"'});\n`;
    return code;
};

Blockly.cake['matrix_x'] = function (block) {
    // Numeric value.
    var code = block.getFieldValue('X');
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['matrix_y'] = function (block) {
    // Numeric value.
    var code = block.getFieldValue('Y');
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['matrix_lamp_single'] = function (block) {
    let x = Blockly.cake.valueToCode(block, "x", Blockly.cake.ORDER_NONE);
    let y = Blockly.cake.valueToCode(block, "y", Blockly.cake.ORDER_NONE);
    // TODO: Assemble cake into code variable.
    let code = `matrix_lamp_single(${Blockly.cake.toStr(x) ? x : '"' + x + '"'}, ${Blockly.cake.toStr(y) ? y : '"' + y + '"'});\n`;
    return code;
};

Blockly.cake['matrix_lamp_text'] = function (block) {
    let text = Blockly.cake.valueToCode(block, "matrix_text", Blockly.cake.ORDER_NONE);
    // let hex = Blockly.cake.charToHexArray(text);
    // TODO: Assemble cake into code variable.
    // const regex = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
    const regex = /^[A-Za-z0-9]+$/;
    const match = regex.exec(text);
    if (match && match.length > 0 && text.indexOf('matrix') === -1) text = match[0].toUpperCase();
    // let code = `char Text[] = {${hex.join(",")}};\nmatrix_text_lamp(Text);\n`;
    let code = `matrix_text_lamp(${Blockly.cake.toStr(text) ? text : '"' + text + '"'});\n`;
    return code;
};

Blockly.cake['matrix_lamp_setRGB'] = function (block) {
    let order = block.getFieldValue('order');
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    // TODO: Assemble cake into code variable.
    let code = `matrix_setRGB_lamp(${Blockly.cake.toStr(order) ? order : '"' + order + '"'}, ${color.replace(/\'/g, '"')});\n`;
    return code;
};

Blockly.cake['matrix_lamp_useRGB'] = function (block) {
    let switchSelect = block.getFieldValue('SWITCH');
    // TODO: Assemble cake into code variable.
    let code = `matrix_useRGB_lamp("${switchSelect}");\n`;
    return code;
};

Blockly.cake['matrix_color'] = function (block) {
    let color = Blockly.cake.valueToCode(block, "COLOR", Blockly.cake.ORDER_ATOMIC);
    Blockly.cake.oldColor = color;
    let newColor;
    if (typeof color === 'string' && color.indexOf('(') === -1 && color.indexOf('#') !== -1) {
        const pre = Blockly.cake.hexToRgb(color);
        // const target = Blockly.cake.rgbToGrb(pre);
        const last = Blockly.cake.grbToHex(pre);
        if (!last) {
            return;
        }
        newColor = last.replace(/\'/g, '');
        newColor = parseInt(newColor).toString();
    } else {
        newColor = color;
    }
    // TODO: Assemble cake into code variable.
    let code = `matrix_color(${Blockly.cake.toStr(newColor) ? newColor : '"' + newColor + '"'});\n`;
    return code;
};

Blockly.cake['matrix_lamp_setSaturation'] = function (block) {
    let saturation = Blockly.cake.valueToCode(block, "saturation", Blockly.cake.ORDER_ATOMIC);

    if(typeof saturation === 'string' && (saturation.indexOf('(') !== -1 || saturation.indexOf('_') !== -1)) {
        return `matrix_color(${saturation});\n`;
    }

    let color = Blockly.cake.oldColor;
    if (color) {
        var m = color.match(/^#(.)\1(.)\2(.)\3$/);
        if (m) {
            color = calculateNewColor([Number('0x' + m[2] + m[2]), Number('0x' + m[1] + m[1]), Number('0x' + m[3] + m[3])], saturation);
            color = '#' + color.join('');
        }
    }

    let newColor;
    if (typeof color === 'string' && color.indexOf('(') === -1 && color.indexOf('#') !== -1 && color.indexOf('_') === -1) {
        const pre = Blockly.cake.hexToRgb(color);
        // const target = Blockly.cake.rgbToGrb(pre);
        const last = Blockly.cake.grbToHex(pre);
        if (!last) {
            return;
        }
        newColor = last.replace(/\'/g, '');
        newColor = parseInt(newColor).toString();
    } else {
        newColor = color;
    }
    // TODO: Assemble cake into code variable.
    let code = `matrix_color(${Blockly.cake.toStr(newColor) ? newColor : '"' + newColor + '"'});\n`;
    return code;

    // 将 RGB 颜色值转换为 HSL 颜色值
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // 灰色
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [h, s, l];
    }

    // 将 HSL 颜色值转换为 RGB 颜色值
    function hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // 计算新的颜色值
    function calculateNewColor(oldColor, saturation) {
        const [r, g, b] = oldColor;

        const [h, s, l] = rgbToHsl(r, g, b);

        const newS = saturation / 100; // 将饱和度转换为小数形式

        const newRgb = hslToRgb(h, newS, l);

        return newRgb;
    }

};