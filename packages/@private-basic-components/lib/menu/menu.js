"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _EllipsisOutlined = _interopRequireDefault(require("@ant-design/icons/EllipsisOutlined"));
var _classnames = _interopRequireDefault(require("classnames"));
var _rcMenu = _interopRequireDefault(require("rc-menu"));
var _rcUtil = require("rc-util");
var _omit = _interopRequireDefault(require("rc-util/lib/omit"));
var _motion = _interopRequireDefault(require("../_util/motion"));
var _reactNode = require("../_util/reactNode");
var _warning = require("../_util/warning");
var _configProvider = require("../config-provider");
var _useItems = _interopRequireDefault(require("./hooks/useItems"));
var _MenuContext = _interopRequireDefault(require("./MenuContext"));
var _OverrideContext = _interopRequireDefault(require("./OverrideContext"));
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const InternalMenu = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var _a, _b;
  const override = React.useContext(_OverrideContext.default);
  const overrideObj = override || {};
  const {
    getPrefixCls,
    getPopupContainer,
    direction,
    menu
  } = React.useContext(_configProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const {
      prefixCls: customizePrefixCls,
      className,
      style,
      theme = 'light',
      expandIcon,
      _internalDisableMenuItemTitleTooltip,
      inlineCollapsed,
      siderCollapsed,
      items,
      children,
      rootClassName,
      mode,
      selectable,
      onClick,
      overflowedIndicatorPopupClassName
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "style", "theme", "expandIcon", "_internalDisableMenuItemTitleTooltip", "inlineCollapsed", "siderCollapsed", "items", "children", "rootClassName", "mode", "selectable", "onClick", "overflowedIndicatorPopupClassName"]);
  const passedProps = (0, _omit.default)(restProps, ['collapsedWidth']);
  // ========================= Items ===========================
  const mergedChildren = (0, _useItems.default)(items) || children;
  // ======================== Warning ==========================
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Menu');
    process.env.NODE_ENV !== "production" ? warning(!('inlineCollapsed' in props && mode !== 'inline'), 'usage', '`inlineCollapsed` should only be used when `mode` is inline.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(props.siderCollapsed !== undefined && 'inlineCollapsed' in props), 'usage', '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.') : void 0;
    warning.deprecated('items' in props && !children, 'children', 'items');
  }
  (_a = overrideObj.validator) === null || _a === void 0 ? void 0 : _a.call(overrideObj, {
    mode
  });
  // ========================== Click ==========================
  // Tell dropdown that item clicked
  const onItemClick = (0, _rcUtil.useEvent)(function () {
    var _a;
    onClick === null || onClick === void 0 ? void 0 : onClick.apply(void 0, arguments);
    (_a = overrideObj.onClick) === null || _a === void 0 ? void 0 : _a.call(overrideObj);
  });
  // ========================== Mode ===========================
  const mergedMode = overrideObj.mode || mode;
  // ======================= Selectable ========================
  const mergedSelectable = selectable !== null && selectable !== void 0 ? selectable : overrideObj.selectable;
  // ======================== Collapsed ========================
  // Inline Collapsed
  const mergedInlineCollapsed = React.useMemo(() => {
    if (siderCollapsed !== undefined) {
      return siderCollapsed;
    }
    return inlineCollapsed;
  }, [inlineCollapsed, siderCollapsed]);
  const defaultMotions = {
    horizontal: {
      motionName: `${rootPrefixCls}-slide-up`
    },
    inline: (0, _motion.default)(rootPrefixCls),
    other: {
      motionName: `${rootPrefixCls}-zoom-big`
    }
  };
  const prefixCls = getPrefixCls('menu', customizePrefixCls || overrideObj.prefixCls);
  const [wrapSSR, hashId] = (0, _style.default)(prefixCls, !override);
  const menuClassName = (0, _classnames.default)(`${prefixCls}-${theme}`, menu === null || menu === void 0 ? void 0 : menu.className, className);
  // ====================== Expand Icon ========================
  let mergedExpandIcon;
  if (typeof expandIcon === 'function') {
    mergedExpandIcon = expandIcon;
  } else if (expandIcon === null || expandIcon === false) {
    mergedExpandIcon = null;
  } else if (overrideObj.expandIcon === null || overrideObj.expandIcon === false) {
    mergedExpandIcon = null;
  } else {
    const beClone = expandIcon !== null && expandIcon !== void 0 ? expandIcon : overrideObj.expandIcon;
    mergedExpandIcon = (0, _reactNode.cloneElement)(beClone, {
      className: (0, _classnames.default)(`${prefixCls}-submenu-expand-icon`, (0, _reactNode.isValidElement)(beClone) ? (_b = beClone.props) === null || _b === void 0 ? void 0 : _b.className : '')
    });
  }
  // ======================== Context ==========================
  const contextValue = React.useMemo(() => ({
    prefixCls,
    inlineCollapsed: mergedInlineCollapsed || false,
    direction,
    firstLevel: true,
    theme,
    mode: mergedMode,
    disableMenuItemTitleTooltip: _internalDisableMenuItemTitleTooltip
  }), [prefixCls, mergedInlineCollapsed, direction, _internalDisableMenuItemTitleTooltip, theme]);
  // ========================= Render ==========================
  return wrapSSR(/*#__PURE__*/React.createElement(_OverrideContext.default.Provider, {
    value: null
  }, /*#__PURE__*/React.createElement(_MenuContext.default.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(_rcMenu.default, Object.assign({
    getPopupContainer: getPopupContainer,
    overflowedIndicator: /*#__PURE__*/React.createElement(_EllipsisOutlined.default, null),
    overflowedIndicatorPopupClassName: (0, _classnames.default)(prefixCls, `${prefixCls}-${theme}`, overflowedIndicatorPopupClassName),
    mode: mergedMode,
    selectable: mergedSelectable,
    onClick: onItemClick
  }, passedProps, {
    inlineCollapsed: mergedInlineCollapsed,
    style: Object.assign(Object.assign({}, menu === null || menu === void 0 ? void 0 : menu.style), style),
    className: menuClassName,
    prefixCls: prefixCls,
    direction: direction,
    defaultMotions: defaultMotions,
    expandIcon: mergedExpandIcon,
    ref: ref,
    rootClassName: (0, _classnames.default)(rootClassName, hashId)
  }), mergedChildren))));
});
var _default = exports.default = InternalMenu;