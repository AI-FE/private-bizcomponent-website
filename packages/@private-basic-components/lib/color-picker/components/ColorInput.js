"use strict";
"use client";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _useMergedState = _interopRequireDefault(require("rc-util/lib/hooks/useMergedState"));
var _react = _interopRequireWildcard(require("react"));
var _select = _interopRequireDefault(require("../../select"));
var _interface = require("../interface");
var _ColorAlphaInput = _interopRequireDefault(require("./ColorAlphaInput"));
var _ColorHexInput = _interopRequireDefault(require("./ColorHexInput"));
var _ColorHsbInput = _interopRequireDefault(require("./ColorHsbInput"));
var _ColorRgbInput = _interopRequireDefault(require("./ColorRgbInput"));
const selectOptions = [_interface.ColorFormat.hex, _interface.ColorFormat.hsb, _interface.ColorFormat.rgb].map(format => ({
  value: format,
  label: format.toLocaleUpperCase()
}));
const ColorInput = props => {
  const {
    prefixCls,
    format,
    value,
    disabledAlpha,
    onFormatChange,
    onChange
  } = props;
  const [colorFormat, setColorFormat] = (0, _useMergedState.default)(_interface.ColorFormat.hex, {
    value: format,
    onChange: onFormatChange
  });
  const colorInputPrefixCls = `${prefixCls}-input`;
  const handleFormatChange = newFormat => {
    setColorFormat(newFormat);
  };
  const steppersNode = (0, _react.useMemo)(() => {
    const inputProps = {
      value,
      prefixCls,
      onChange
    };
    switch (colorFormat) {
      case _interface.ColorFormat.hsb:
        return /*#__PURE__*/_react.default.createElement(_ColorHsbInput.default, Object.assign({}, inputProps));
      case _interface.ColorFormat.rgb:
        return /*#__PURE__*/_react.default.createElement(_ColorRgbInput.default, Object.assign({}, inputProps));
      case _interface.ColorFormat.hex:
      default:
        return /*#__PURE__*/_react.default.createElement(_ColorHexInput.default, Object.assign({}, inputProps));
    }
  }, [colorFormat, prefixCls, value, onChange]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${colorInputPrefixCls}-container`
  }, /*#__PURE__*/_react.default.createElement(_select.default, {
    value: colorFormat,
    bordered: false,
    getPopupContainer: current => current,
    popupMatchSelectWidth: 68,
    placement: "bottomRight",
    onChange: handleFormatChange,
    className: `${prefixCls}-format-select`,
    size: "small",
    options: selectOptions
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: colorInputPrefixCls
  }, steppersNode), !disabledAlpha && (/*#__PURE__*/_react.default.createElement(_ColorAlphaInput.default, {
    prefixCls: prefixCls,
    value: value,
    onChange: onChange
  })));
};
var _default = exports.default = ColorInput;