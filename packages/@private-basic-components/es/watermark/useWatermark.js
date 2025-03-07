"use client";

import * as React from 'react';
import { getStyleStr } from './utils';
/**
 * Base size of the canvas, 1 for parallel layout and 2 for alternate layout
 * Only alternate layout is currently supported
 */
export const BaseSize = 2;
export const FontGap = 3;
export default function useWatermark(markStyle) {
  const [watermarkMap] = React.useState(() => new Map());
  const appendWatermark = (base64Url, markWidth, container) => {
    if (container) {
      if (!watermarkMap.get(container)) {
        const newWatermarkEle = document.createElement('div');
        watermarkMap.set(container, newWatermarkEle);
      }
      const watermarkEle = watermarkMap.get(container);
      watermarkEle.setAttribute('style', getStyleStr(Object.assign(Object.assign({}, markStyle), {
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