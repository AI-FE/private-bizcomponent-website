"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons/CloseOutlined"));
var _classnames = _interopRequireDefault(require("classnames"));
var _colors = require("../_util/colors");
var _useClosable = _interopRequireDefault(require("../_util/hooks/useClosable"));
var _warning = require("../_util/warning");
var _wave = _interopRequireDefault(require("../_util/wave"));
var _configProvider = require("../config-provider");
var _CheckableTag = _interopRequireDefault(require("./CheckableTag"));
var _style = _interopRequireDefault(require("./style"));
var _presetCmp = _interopRequireDefault(require("./style/presetCmp"));
var _statusCmp = _interopRequireDefault(require("./style/statusCmp"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const InternalTag = (tagProps, ref) => {
  const {
      prefixCls: customizePrefixCls,
      className,
      rootClassName,
      style,
      children,
      icon,
      color,
      onClose,
      closeIcon,
      closable,
      bordered = true
    } = tagProps,
    props = __rest(tagProps, ["prefixCls", "className", "rootClassName", "style", "children", "icon", "color", "onClose", "closeIcon", "closable", "bordered"]);
  const {
    getPrefixCls,
    direction,
    tag
  } = React.useContext(_configProvider.ConfigContext);
  const [visible, setVisible] = React.useState(true);
  // Warning for deprecated usage
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Tag');
    warning.deprecated(!('visible' in props), 'visible', 'visible && <Tag />');
  }
  React.useEffect(() => {
    if ('visible' in props) {
      setVisible(props.visible);
    }
  }, [props.visible]);
  const isPreset = (0, _colors.isPresetColor)(color);
  const isStatus = (0, _colors.isPresetStatusColor)(color);
  const isInternalColor = isPreset || isStatus;
  const tagStyle = Object.assign(Object.assign({
    backgroundColor: color && !isInternalColor ? color : undefined
  }, tag === null || tag === void 0 ? void 0 : tag.style), style);
  const prefixCls = getPrefixCls('tag', customizePrefixCls);
  // Style
  const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
  const tagClassName = (0, _classnames.default)(prefixCls, tag === null || tag === void 0 ? void 0 : tag.className, {
    [`${prefixCls}-${color}`]: isInternalColor,
    [`${prefixCls}-has-color`]: color && !isInternalColor,
    [`${prefixCls}-hidden`]: !visible,
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-borderless`]: !bordered
  }, className, rootClassName, hashId);
  const handleCloseClick = e => {
    e.stopPropagation();
    onClose === null || onClose === void 0 ? void 0 : onClose(e);
    if (e.defaultPrevented) {
      return;
    }
    setVisible(false);
  };
  const [, mergedCloseIcon] = (0, _useClosable.default)(closable, closeIcon, iconNode => iconNode === null ? (/*#__PURE__*/React.createElement(_CloseOutlined.default, {
    className: `${prefixCls}-close-icon`,
    onClick: handleCloseClick
  })) : (/*#__PURE__*/React.createElement("span", {
    className: `${prefixCls}-close-icon`,
    onClick: handleCloseClick
  }, iconNode)), null, false);
  const isNeedWave = typeof props.onClick === 'function' || children && children.type === 'a';
  const iconNode = icon || null;
  const kids = iconNode ? (/*#__PURE__*/React.createElement(React.Fragment, null, iconNode, children && /*#__PURE__*/React.createElement("span", null, children))) : children;
  const tagNode = /*#__PURE__*/React.createElement("span", Object.assign({}, props, {
    ref: ref,
    className: tagClassName,
    style: tagStyle
  }), kids, mergedCloseIcon, isPreset && /*#__PURE__*/React.createElement(_presetCmp.default, {
    key: "preset",
    prefixCls: prefixCls
  }), isStatus && /*#__PURE__*/React.createElement(_statusCmp.default, {
    key: "status",
    prefixCls: prefixCls
  }));
  return wrapSSR(isNeedWave ? /*#__PURE__*/React.createElement(_wave.default, {
    component: "Tag"
  }, tagNode) : tagNode);
};
const Tag = /*#__PURE__*/React.forwardRef(InternalTag);
if (process.env.NODE_ENV !== 'production') {
  Tag.displayName = 'Tag';
}
Tag.CheckableTag = _CheckableTag.default;
var _default = exports.default = Tag;