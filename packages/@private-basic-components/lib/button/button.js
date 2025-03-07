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
var _omit = _interopRequireDefault(require("rc-util/lib/omit"));
var _ref = require("rc-util/lib/ref");
var _warning = require("../_util/warning");
var _wave = _interopRequireDefault(require("../_util/wave"));
var _configProvider = require("../config-provider");
var _DisabledContext = _interopRequireDefault(require("../config-provider/DisabledContext"));
var _useSize = _interopRequireDefault(require("../config-provider/hooks/useSize"));
var _Compact = require("../space/Compact");
var _buttonGroup = _interopRequireWildcard(require("./button-group"));
var _buttonHelpers = require("./buttonHelpers");
var _IconWrapper = _interopRequireDefault(require("./IconWrapper"));
var _LoadingIcon = _interopRequireDefault(require("./LoadingIcon"));
var _style = _interopRequireDefault(require("./style"));
var _compactCmp = _interopRequireDefault(require("./style/compactCmp"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/* eslint-disable react/button-has-type */

function getLoadingConfig(loading) {
  if (typeof loading === 'object' && loading) {
    const delay = loading === null || loading === void 0 ? void 0 : loading.delay;
    const isDelay = !Number.isNaN(delay) && typeof delay === 'number';
    return {
      loading: false,
      delay: isDelay ? delay : 0
    };
  }
  return {
    loading: !!loading,
    delay: 0
  };
}
const InternalButton = (props, ref) => {
  var _a, _b;
  const {
      loading = false,
      prefixCls: customizePrefixCls,
      type = 'default',
      danger,
      shape = 'default',
      size: customizeSize,
      styles,
      disabled: customDisabled,
      className,
      rootClassName,
      children,
      icon,
      ghost = false,
      block = false,
      // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
      htmlType = 'button',
      classNames: customClassNames,
      style: customStyle = {}
    } = props,
    rest = __rest(props, ["loading", "prefixCls", "type", "danger", "shape", "size", "styles", "disabled", "className", "rootClassName", "children", "icon", "ghost", "block", "htmlType", "classNames", "style"]);
  const {
    getPrefixCls,
    autoInsertSpaceInButton,
    direction,
    button
  } = (0, _react.useContext)(_configProvider.ConfigContext);
  const prefixCls = getPrefixCls('btn', customizePrefixCls);
  const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
  const disabled = (0, _react.useContext)(_DisabledContext.default);
  const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
  const groupSize = (0, _react.useContext)(_buttonGroup.GroupSizeContext);
  const loadingOrDelay = (0, _react.useMemo)(() => getLoadingConfig(loading), [loading]);
  const [innerLoading, setLoading] = (0, _react.useState)(loadingOrDelay.loading);
  const [hasTwoCNChar, setHasTwoCNChar] = (0, _react.useState)(false);
  const internalRef = /*#__PURE__*/(0, _react.createRef)();
  const buttonRef = (0, _ref.composeRef)(ref, internalRef);
  const needInserted = _react.Children.count(children) === 1 && !icon && !(0, _buttonHelpers.isUnBorderedButtonType)(type);
  (0, _react.useEffect)(() => {
    let delayTimer = null;
    if (loadingOrDelay.delay > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = null;
        setLoading(true);
      }, loadingOrDelay.delay);
    } else {
      setLoading(loadingOrDelay.loading);
    }
    function cleanupTimer() {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    }
    return cleanupTimer;
  }, [loadingOrDelay]);
  (0, _react.useEffect)(() => {
    // FIXME: for HOC usage like <FormatMessage />
    if (!buttonRef || !buttonRef.current || autoInsertSpaceInButton === false) {
      return;
    }
    const buttonText = buttonRef.current.textContent;
    if (needInserted && (0, _buttonHelpers.isTwoCNChar)(buttonText)) {
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true);
      }
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false);
    }
  }, [buttonRef]);
  const handleClick = e => {
    const {
      onClick
    } = props;
    // FIXME: https://github.com/ant-design/ant-design/issues/30207
    if (innerLoading || mergedDisabled) {
      e.preventDefault();
      return;
    }
    onClick === null || onClick === void 0 ? void 0 : onClick(e);
  };
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Button');
    process.env.NODE_ENV !== "production" ? warning(!(typeof icon === 'string' && icon.length > 2), 'breaking', `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`) : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(ghost && (0, _buttonHelpers.isUnBorderedButtonType)(type)), 'usage', "`link` or `text` button can't be a `ghost` button.") : void 0;
  }
  const autoInsertSpace = autoInsertSpaceInButton !== false;
  const {
    compactSize,
    compactItemClassnames
  } = (0, _Compact.useCompactItemContext)(prefixCls, direction);
  const sizeClassNameMap = {
    large: 'lg',
    small: 'sm',
    middle: undefined
  };
  const sizeFullName = (0, _useSize.default)(ctxSize => {
    var _a, _b;
    return (_b = (_a = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a !== void 0 ? _a : groupSize) !== null && _b !== void 0 ? _b : ctxSize;
  });
  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName] || '' : '';
  const iconType = innerLoading ? 'loading' : icon;
  const linkButtonRestProps = (0, _omit.default)(rest, ['navigate']);
  const classes = (0, _classnames.default)(prefixCls, hashId, {
    [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${sizeCls}`]: sizeCls,
    [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
    [`${prefixCls}-background-ghost`]: ghost && !(0, _buttonHelpers.isUnBorderedButtonType)(type),
    [`${prefixCls}-loading`]: innerLoading,
    [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace && !innerLoading,
    [`${prefixCls}-block`]: block,
    [`${prefixCls}-dangerous`]: !!danger,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, compactItemClassnames, className, rootClassName, button === null || button === void 0 ? void 0 : button.className);
  const fullStyle = Object.assign(Object.assign({}, button === null || button === void 0 ? void 0 : button.style), customStyle);
  const iconClasses = (0, _classnames.default)(customClassNames === null || customClassNames === void 0 ? void 0 : customClassNames.icon, (_a = button === null || button === void 0 ? void 0 : button.classNames) === null || _a === void 0 ? void 0 : _a.icon);
  const iconStyle = Object.assign(Object.assign({}, (styles === null || styles === void 0 ? void 0 : styles.icon) || {}), ((_b = button === null || button === void 0 ? void 0 : button.styles) === null || _b === void 0 ? void 0 : _b.icon) || {});
  const iconNode = icon && !innerLoading ? (/*#__PURE__*/_react.default.createElement(_IconWrapper.default, {
    prefixCls: prefixCls,
    className: iconClasses,
    style: iconStyle
  }, icon)) : (/*#__PURE__*/_react.default.createElement(_LoadingIcon.default, {
    existIcon: !!icon,
    prefixCls: prefixCls,
    loading: !!innerLoading
  }));
  const kids = children || children === 0 ? (0, _buttonHelpers.spaceChildren)(children, needInserted && autoInsertSpace) : null;
  if (linkButtonRestProps.href !== undefined) {
    return wrapSSR(/*#__PURE__*/_react.default.createElement("a", Object.assign({}, linkButtonRestProps, {
      className: (0, _classnames.default)(classes, {
        [`${prefixCls}-disabled`]: mergedDisabled
      }),
      style: fullStyle,
      onClick: handleClick,
      ref: buttonRef
    }), iconNode, kids));
  }
  let buttonNode = /*#__PURE__*/_react.default.createElement("button", Object.assign({}, rest, {
    type: htmlType,
    className: classes,
    style: fullStyle,
    onClick: handleClick,
    disabled: mergedDisabled,
    ref: buttonRef
  }), iconNode, kids, compactItemClassnames && /*#__PURE__*/_react.default.createElement(_compactCmp.default, {
    key: "compact",
    prefixCls: prefixCls
  }));
  if (!(0, _buttonHelpers.isUnBorderedButtonType)(type)) {
    buttonNode = /*#__PURE__*/_react.default.createElement(_wave.default, {
      component: "Button",
      disabled: !!innerLoading
    }, buttonNode);
  }
  return wrapSSR(buttonNode);
};
const Button = /*#__PURE__*/(0, _react.forwardRef)(InternalButton);
if (process.env.NODE_ENV !== 'production') {
  Button.displayName = 'Button';
}
Button.Group = _buttonGroup.default;
Button.__ANT_BUTTON = true;
var _default = exports.default = Button;