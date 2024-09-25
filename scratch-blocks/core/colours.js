/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
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

'use strict';

goog.provide('Blockly.Colours');

Blockly.Colours = {
  // SVG colours: these must be specificed in #RRGGBB style
  // To add an opacity, this must be specified as a separate property (for SVG fill-opacity)
  "motion": {
    "primary": "#64c7f0",
    "secondary": "#4280D7",
    "tertiary": "#00b0f9"
  },
  "motor": {
    "primary": "#64c7f0",
    "secondary": "#00b0f9",
    "tertiary": "#00b0f9",
    "quaternary": "#00b0f9"
  },
  "combined_motor": {
    "primary": "#2388ca",
    "secondary": "#4280D7",
    "tertiary": "#3373CC"
  },
  "matrix": {
    "primary": "#7986b8",
    "secondary": "#855CD6",
    "tertiary": "#6877b3"
  },
  "looks": {
    "primary": "#9966FF",
    "secondary": "#855CD6",
    "tertiary": "#774DCB"
  },
  "sounds": {
    "primary": "#a981a4",
    "secondary": "#8f6e8a",
    "tertiary": "#8f6e8a"
  },
  "control": {
    "primary": "#e76564",
    "secondary": "#EC9C13",
    "tertiary": "#cf5959"
  },
  "event": {
    "primary": "#cd758f",
    "secondary": "#be637f",
    "tertiary": "#be637f"
  },
  "sensing": {
    "primary": "#f18e2f",
    "secondary": "#f18e2f",
    "tertiary": "#d67214"
  },
  "sensing_camera": {
    "primary": "#0fbd8c",
    "secondary": "#0fbd8c",
    "tertiary": "#0fbd8c",
  },
  "pen": {
    "primary": "#0fBD8C",
    "secondary": "#0DA57A",
    "tertiary": "#0B8E69"
  },
  "operators": {
    "primary": "#f5b44a",
    "secondary": "#46B946",
    "tertiary": "#e49e2f"
  },
  "data": {
    "primary": "#dac461",
    "secondary": "#FF8000",
    "tertiary": "#c29e00"
  },
  // This is not a new category, but rather for differentiation
  // between lists and scalar variables.
  "data_lists": {
    "primary": "#dac461",
    "secondary": "#FF5500",
    "tertiary": "#c29e00"
  },
  "more": {
    "primary": "#82be97",
    "secondary": "#FF4D6A",
    "tertiary": "#FF3355"
  },
  "text": "#575E75",
  "workspace": "#F9F9F9",
  "toolboxHover": "#4C97FF",
  "toolboxSelected": "#e9eef2",
  "toolboxText": "#575E75",
  "toolbox": "#FFFFFF",
  "flyout": "#F9F9F9",
  "scrollbar": "#CECDCE",
  "scrollbarHover": '#CECDCE',
  "textField": "#FFFFFF",
  "insertionMarker": "#000000",
  "insertionMarkerOpacity": 0.2,
  "dragShadowOpacity": 0.3,
  "stackGlow": "#FFF200",
  "stackGlowSize": 4,
  "stackGlowOpacity": 1,
  "replacementGlow": "#FFFFFF",
  "replacementGlowSize": 2,
  "replacementGlowOpacity": 1,
  "colourPickerStroke": "#FFFFFF",
  // CSS colours: support RGBA
  "fieldShadow": "rgba(0,0,0,0.1)",
  "dropDownShadow": "rgba(0, 0, 0, .3)",
  "numPadBackground": "#547AB2",
  "numPadBorder": "#435F91",
  "numPadActiveBackground": "#435F91",
  "numPadText": "white", // Do not use hex here, it cannot be inlined with data-uri SVG
  "valueReportBackground": "#FFFFFF",
  "valueReportBorder": "#AAAAAA"
};

/**
 * Override the colours in Blockly.Colours with new values basded on the
 * given dictionary.
 * @param {!Object} colours Dictionary of colour properties and new values.
 * @package
 */
Blockly.Colours.overrideColours = function (colours) {
  // Colour overrides provided by the injection
  if (colours) {
    for (var colourProperty in colours) {
      if (colours.hasOwnProperty(colourProperty) &&
        Blockly.Colours.hasOwnProperty(colourProperty)) {
        // If a property is in both colours option and Blockly.Colours,
        // set the Blockly.Colours value to the override.
        // Override Blockly category color object properties with those
        // provided.
        var colourPropertyValue = colours[colourProperty];
        if (goog.isObject(colourPropertyValue)) {
          for (var colourSequence in colourPropertyValue) {
            if (colourPropertyValue.hasOwnProperty(colourSequence) &&
              Blockly.Colours[colourProperty].hasOwnProperty(colourSequence)) {
              Blockly.Colours[colourProperty][colourSequence] =
                colourPropertyValue[colourSequence];
            }
          }
        } else {
          Blockly.Colours[colourProperty] = colourPropertyValue;
        }
      }
    }
  }
};
