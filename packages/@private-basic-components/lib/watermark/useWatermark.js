"use strict";
"use client";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FontGap = exports.BaseSize = void 0;
exports.default = useWatermark;
var React = _interopRequireWildcard(require("react"));
var _utils = require("./utils");
/**
 * Base size of the canvas, 1 for parallel layout and 2 for alternate layout
 * Only alternate layout is currently supported
 */
const BaseSize = exports.BaseSize = 2;
const FontGap = exports.FontGap = 3;
function useWatermark(markStyle) {
  const [watermarkMap] = React.useState(() => new Map());
  const appendWatermark = (base64Url, markWidth, container) => {
    if (container) {
      if (!watermarkMap.get(container)) {
        const newWatermarkEle = document.createElement('div');
        watermarkMap.set(container, newWatermarkEle);
      }
      const watermarkEle = watermarkMap.get(container);
      watermarkEle.setAttribute('style', (0, _utils.getStyleStr)(Object.assign(Object.assign({}, markStyle), {
        backgroundImage: `url('${base64Url}')`,
        backgroundSize: `${Math.floor(markWidth)}px`
      })));
      container.append(watermarkEle);
    }
  };
  const removeWatermark = container => {
    const watermarkEle = watermarkMap.get(container);
    if (watermarkEle && container) {
      container.removeChild(watermarkEle);
    }
    watermarkMap.delete(container);
  };
  const isWatermarkEle = ele => Array.from(watermarkMap.values()).includes(ele);
  return [appendWatermark, removeWatermark, isWatermarkEle];
}