"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _useMergedState = _interopRequireDefault(require("rc-util/lib/hooks/useMergedState"));
var _PurePanel = _interopRequireDefault(require("../_util/PurePanel"));
var _statusUtils = require("../_util/statusUtils");
var _warning = require("../_util/warning");
var _context = require("../config-provider/context");
var _useSize = _interopRequireDefault(require("../config-provider/hooks/useSize"));
var _context2 = require("../form/context");
var _popover = _interopRequireDefault(require("../popover"));
var _internal = require("../theme/internal");
var _ColorPickerPanel = _interopRequireDefault(require("./ColorPickerPanel"));
var _ColorTrigger = _interopRequireDefault(require("./components/ColorTrigger"));
var _useColorState = _interopRequireDefault(require("./hooks/useColorState"));
var _index = _interopRequireDefault(require("./style/index"));
var _util = require("./util");
const ColorPicker = props => {
  const {
    value,
    defaultValue,
    format,
    defaultFormat,
    allowClear = false,
    presets,
    children,
    trigger = 'click',
    open,
    disabled,
    placement = 'bottomLeft',
    arrow = true,
    panelRender,
    showText,
    style,
    className,
    size: customizeSize,
    rootClassName,
    styles,
    disabledAlpha = false,
    onFormatChange,
    onChange,
    onClear,
    onOpenChange,
    onChangeComplete,
    getPopupContainer,
    autoAdjustOverflow = true,
    destroyTooltipOnHide
  } = props;
  const {
    getPrefixCls,
    direction,
    colorPicker
  } = (0, _react.useContext)(_context.ConfigContext);
  const [, token] = (0, _internal.useToken)();
  const [colorValue, setColorValue] = (0, _useColorState.default)(token.colorPrimary, {
    value,
    defaultValue
  });
  const [popupOpen, setPopupOpen] = (0, _useMergedState.default)(false, {
    value: open,
    postState: openData => !disabled && openData,
    onChange: onOpenChange
  });
  const [formatValue, setFormatValue] = (0, _useMergedState.default)(format, {
    value: format,
    defaultValue: defaultFormat,
    onChange: onFormatChange
  });
  const [colorCleared, setColorCleared] = (0, _react.useState)(false);
  const prefixCls = getPrefixCls('color-picker', _util.customizePrefixCls);
  const isAlphaColor = (0, _react.useMemo)(() => (0, _util.getAlphaColor)(colorValue) < 100, [colorValue]);
  // ===================== Form Status =====================
  const {
    status: contextStatus
  } = _react.default.useContext(_context2.FormItemInputContext);
  // ===================== Style =====================
  const mergedSize = (0, _useSize.default)(customizeSize);
  const [wrapSSR, hashId] = (0, _index.default)(prefixCls);
  const rtlCls = {
    [`${prefixCls}-rtl`]: direction
  };
  const mergeRootCls = (0, _classnames.default)(rootClassName, rtlCls);
  const mergeCls = (0, _classnames.default)((0, _statusUtils.getStatusClassNames)(prefixCls, contextStatus), {
    [`${prefixCls}-sm`]: mergedSize === 'small',
    [`${prefixCls}-lg`]: mergedSize === 'large'
  }, colorPicker === null || colorPicker === void 0 ? void 0 : colorPicker.className, mergeRootCls, className, hashId);
  const mergePopupCls = (0, _classnames.default)(prefixCls, rtlCls);
  const popupAllowCloseRef = (0, _react.useRef)(true);
  // ===================== Warning ======================
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('ColorPicker');
    process.env.NODE_ENV !== "production" ? warning(!(disabledAlpha && isAlphaColor), 'usage', '`disabledAlpha` will make the alpha to be 100% when use alpha color.') : void 0;
  }
  const handleChange = (data, type, pickColor) => {
    let color = (0, _util.generateColor)(data);
    const isNull = value === null || !value && defaultValue === null;
    if (colorCleared || isNull) {
      setColorCleared(false);
      // ignore alpha slider
      if ((0, _util.getAlphaColor)(colorValue) === 0 && type !== 'alpha') {
        color = (0, _util.genAlphaColor)(color);
      }
    }
    // ignore alpha color
    if (disabledAlpha && isAlphaColor) {
      color = (0, _util.genAlphaColor)(color);
    }
    // Only for drag-and-drop color picking
    if (pickColor) {
      popupAllowCloseRef.current = false;
    } else {
      onChangeComplete === null || onChangeComplete === void 0 ? void 0 : onChangeComplete(color);
    }
    setColorValue(color);
    onChange === null || onChange === void 0 ? void 0 : onChange(color, color.toHexString());
  };
  const handleClear = () => {
    setColorCleared(true);
    onClear === null || onClear === void 0 ? void 0 : onClear();
  };
  const handleChangeComplete = color => {
    popupAllowCloseRef.current = true;
    let changeColor = (0, _util.generateColor)(color);
    // ignore alpha color
    if (disabledAlpha && isAlphaColor) {
      changeColor = (0, _util.genAlphaColor)(color);
    }
    onChangeComplete === null || onChangeComplete === void 0 ? void 0 : onChangeComplete(changeColor);
  };
  const popoverProps = {
    open: popupOpen,
    trigger,
    placement,
    arrow,
    rootClassName,
    getPopupContainer,
    autoAdjustOverflow,
    destroyTooltipOnHide
  };
  const colorBaseProps = {
    prefixCls,
    color: colorValue,
    allowClear,
    colorCleared,
    disabled,
    disabledAlpha,
    presets,
    panelRender,
    format: formatValue,
    onFormatChange: setFormatValue,
    onChangeComplete: handleChangeComplete
  };
  const mergedStyle = Object.assign(Object.assign({}, colorPicker === null || colorPicker === void 0 ? void 0 : colorPicker.style), style);
  return wrapSSR(/*#__PURE__*/_react.default.createElement(_popover.default, Object.assign({
    style: styles === null || styles === void 0 ? void 0 : styles.popup,
    overlayInnerStyle: styles === null || styles === void 0 ? void 0 : styles.popupOverlayInner,
    onOpenChange: visible => {
      if (popupAllowCloseRef.current && !disabled) {
        setPopupOpen(visible);
      }
    },
    content: /*#__PURE__*/_react.default.createElement(_context2.NoFormStyle, {
      override: true,
      status: true
    }, /*#__PURE__*/_react.default.createElement(_ColorPickerPanel.default, Object.assign({}, colorBaseProps, {
      onChange: handleChange,
      onChangeComplete: handleChangeComplete,
      onClear: handleClear
    }))),
    overlayClassName: mergePopupCls
  }, popoverProps), children || (/*#__PURE__*/_react.default.createElement(_ColorTrigger.default, {
    open: popupOpen,
    className: mergeCls,
    style: mergedStyle,
    color: value ? (0, _util.generateColor)(value) : colorValue,
    prefixCls: prefixCls,
    disabled: disabled,
    colorCleared: colorCleared,
    showText: showText,
    format: formatValue
  }))));
};
if (process.env.NODE_ENV !== 'production') {
  ColorPicker.displayName = 'ColorPicker';
}
const PurePanel = (0, _PurePanel.default)(ColorPicker, 'color-picker', /* istanbul ignore next */
prefixCls => prefixCls, props => Object.assign(Object.assign({}, props), {
  placement: 'bottom',
  autoAdjustOverflow: false
}));
ColorPicker._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
var _default = exports.default = ColorPicker;