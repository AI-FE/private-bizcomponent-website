"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.triggerFocus = triggerFocus;
var _react = _interopRequireWildcard(require("react"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons/CloseCircleFilled"));
var _classnames = _interopRequireDefault(require("classnames"));
var _rcInput = _interopRequireDefault(require("rc-input"));
var _ref = require("rc-util/lib/ref");
var _statusUtils = require("../_util/statusUtils");
var _warning = require("../_util/warning");
var _configProvider = require("../config-provider");
var _DisabledContext = _interopRequireDefault(require("../config-provider/DisabledContext"));
var _useSize = _interopRequireDefault(require("../config-provider/hooks/useSize"));
var _context = require("../form/context");
var _Compact = require("../space/Compact");
var _useRemovePasswordTimeout = _interopRequireDefault(require("./hooks/useRemovePasswordTimeout"));
var _style = _interopRequireDefault(require("./style"));
var _utils = require("./utils");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function triggerFocus(element, option) {
  if (!element) {
    return;
  }
  element.focus(option);
  // Selection content
  const {
    cursor
  } = option || {};
  if (cursor) {
    const len = element.value.length;
    switch (cursor) {
      case 'start':
        element.setSelectionRange(0, 0);
        break;
      case 'end':
        element.setSelectionRange(len, len);
        break;
      default:
        element.setSelectionRange(0, len);
        break;
    }
  }
}
const Input = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var _a;
  const {
      prefixCls: customizePrefixCls,
      bordered = true,
      status: customStatus,
      size: customSize,
      disabled: customDisabled,
      onBlur,
      onFocus,
      suffix,
      allowClear,
      addonAfter,
      addonBefore,
      className,
      style,
      styles,
      rootClassName,
      onChange,
      classNames: classes
    } = props,
    rest = __rest(props, ["prefixCls", "bordered", "status", "size", "disabled", "onBlur", "onFocus", "suffix", "allowClear", "addonAfter", "addonBefore", "className", "style", "styles", "rootClassName", "onChange", "classNames"]);
  const {
    getPrefixCls,
    direction,
    input
  } = _react.default.useContext(_configProvider.ConfigContext);
  const prefixCls = getPrefixCls('input', customizePrefixCls);
  const inputRef = (0, _react.useRef)(null);
  // Style
  const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
  // ===================== Compact Item =====================
  const {
    compactSize,
    compactItemClassnames
  } = (0, _Compact.useCompactItemContext)(prefixCls, direction);
  // ===================== Size =====================
  const mergedSize = (0, _useSize.default)(ctx => {
    var _a;
    return (_a = customSize !== null && customSize !== void 0 ? customSize : compactSize) !== null && _a !== void 0 ? _a : ctx;
  });
  // ===================== Disabled =====================
  const disabled = _react.default.useContext(_DisabledContext.default);
  const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
  // ===================== Status =====================
  const {
    status: contextStatus,
    hasFeedback,
    feedbackIcon
  } = (0, _react.useContext)(_context.FormItemInputContext);
  const mergedStatus = (0, _statusUtils.getMergedStatus)(contextStatus, customStatus);
  // ===================== Focus warning =====================
  const inputHasPrefixSuffix = (0, _utils.hasPrefixSuffix)(props) || !!hasFeedback;
  const prevHasPrefixSuffix = (0, _react.useRef)(inputHasPrefixSuffix);
  /* eslint-disable react-hooks/rules-of-hooks */
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Input');
    (0, _react.useEffect)(() => {
      var _a;
      if (inputHasPrefixSuffix && !prevHasPrefixSuffix.current) {
        process.env.NODE_ENV !== "production" ? warning(document.activeElement === ((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.input), 'usage', `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change. Read more: https://ant.design/components/input/#FAQ`) : void 0;
      }
      prevHasPrefixSuffix.current = inputHasPrefixSuffix;
    }, [inputHasPrefixSuffix]);
  }
  /* eslint-enable */
  // ===================== Remove Password value =====================
  const removePasswordTimeout = (0, _useRemovePasswordTimeout.default)(inputRef, true);
  const handleBlur = e => {
    removePasswordTimeout();
    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
  };
  const handleFocus = e => {
    removePasswordTimeout();
    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
  };
  const handleChange = e => {
    removePasswordTimeout();
    onChange === null || onChange === void 0 ? void 0 : onChange(e);
  };
  const suffixNode = (hasFeedback || suffix) && (/*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, suffix, hasFeedback && feedbackIcon));
  // Allow clear
  let mergedAllowClear;
  if (typeof allowClear === 'object' && (allowClear === null || allowClear === void 0 ? void 0 : allowClear.clearIcon)) {
    mergedAllowClear = allowClear;
  } else if (allowClear) {
    mergedAllowClear = {
      clearIcon: /*#__PURE__*/_react.default.createElement(_CloseCircleFilled.default, null)
    };
  }
  return wrapSSR(/*#__PURE__*/_react.default.createElement(_rcInput.default, Object.assign({
    ref: (0, _ref.composeRef)(ref, inputRef),
    prefixCls: prefixCls,
    autoComplete: input === null || input === void 0 ? void 0 : input.autoComplete
  }, rest, {
    disabled: mergedDisabled,
    onBlur: handleBlur,
    onFocus: handleFocus,
    style: Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.style), style),
    styles: Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.styles), styles),
    suffix: suffixNode,
    allowClear: mergedAllowClear,
    className: (0, _classnames.default)(className, rootClassName, compactItemClassnames, input === null || input === void 0 ? void 0 : input.className),
    onChange: handleChange,
    addonAfter: addonAfter && (/*#__PURE__*/_react.default.createElement(_Compact.NoCompactStyle, null, /*#__PURE__*/_react.default.createElement(_context.NoFormStyle, {
      override: true,
      status: true
    }, addonAfter))),
    addonBefore: addonBefore && (/*#__PURE__*/_react.default.createElement(_Compact.NoCompactStyle, null, /*#__PURE__*/_react.default.createElement(_context.NoFormStyle, {
      override: true,
      status: true
    }, addonBefore))),
    classNames: Object.assign(Object.assign(Object.assign({}, classes), input === null || input === void 0 ? void 0 : input.classNames), {
      input: (0, _classnames.default)({
        [`${prefixCls}-sm`]: mergedSize === 'small',
        [`${prefixCls}-lg`]: mergedSize === 'large',
        [`${prefixCls}-rtl`]: direction === 'rtl',
        [`${prefixCls}-borderless`]: !bordered
      }, !inputHasPrefixSuffix && (0, _statusUtils.getStatusClassNames)(prefixCls, mergedStatus), classes === null || classes === void 0 ? void 0 : classes.input, (_a = input === null || input === void 0 ? void 0 : input.classNames) === null || _a === void 0 ? void 0 : _a.input, hashId)
    }),
    classes: {
      affixWrapper: (0, _classnames.default)({
        [`${prefixCls}-affix-wrapper-sm`]: mergedSize === 'small',
        [`${prefixCls}-affix-wrapper-lg`]: mergedSize === 'large',
        [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
        [`${prefixCls}-affix-wrapper-borderless`]: !bordered
      }, (0, _statusUtils.getStatusClassNames)(`${prefixCls}-affix-wrapper`, mergedStatus, hasFeedback), hashId),
      wrapper: (0, _classnames.default)({
        [`${prefixCls}-group-rtl`]: direction === 'rtl'
      }, hashId),
      group: (0, _classnames.default)({
        [`${prefixCls}-group-wrapper-sm`]: mergedSize === 'small',
        [`${prefixCls}-group-wrapper-lg`]: mergedSize === 'large',
        [`${prefixCls}-group-wrapper-rtl`]: direction === 'rtl',
        [`${prefixCls}-group-wrapper-disabled`]: mergedDisabled
      }, (0, _statusUtils.getStatusClassNames)(`${prefixCls}-group-wrapper`, mergedStatus, hasFeedback), hashId)
    }
  })));
});
var _default = exports.default = Input;