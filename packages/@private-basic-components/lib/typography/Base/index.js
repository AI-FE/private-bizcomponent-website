"use strict";
"use client";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CheckOutlined = _interopRequireDefault(require("@ant-design/icons/CheckOutlined"));
var _CopyOutlined = _interopRequireDefault(require("@ant-design/icons/CopyOutlined"));
var _EditOutlined = _interopRequireDefault(require("@ant-design/icons/EditOutlined"));
var _classnames = _interopRequireDefault(require("classnames"));
var _copyToClipboard = _interopRequireDefault(require("copy-to-clipboard"));
var _rcResizeObserver = _interopRequireDefault(require("rc-resize-observer"));
var _toArray = _interopRequireDefault(require("rc-util/lib/Children/toArray"));
var _useLayoutEffect = _interopRequireDefault(require("rc-util/lib/hooks/useLayoutEffect"));
var _useMergedState = _interopRequireDefault(require("rc-util/lib/hooks/useMergedState"));
var _omit = _interopRequireDefault(require("rc-util/lib/omit"));
var _ref3 = require("rc-util/lib/ref");
var React = _interopRequireWildcard(require("react"));
var _styleChecker = require("../../_util/styleChecker");
var _transButton = _interopRequireDefault(require("../../_util/transButton"));
var _configProvider = require("../../config-provider");
var _useLocale = _interopRequireDefault(require("../../locale/useLocale"));
var _tooltip = _interopRequireDefault(require("../../tooltip"));
var _Editable = _interopRequireDefault(require("../Editable"));
var _Typography = _interopRequireDefault(require("../Typography"));
var _useMergedConfig = _interopRequireDefault(require("../hooks/useMergedConfig"));
var _useUpdatedEffect = _interopRequireDefault(require("../hooks/useUpdatedEffect"));
var _Ellipsis = _interopRequireDefault(require("./Ellipsis"));
var _EllipsisTooltip = _interopRequireDefault(require("./EllipsisTooltip"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function wrapperDecorations(_ref, content) {
  let {
    mark,
    code,
    underline,
    delete: del,
    strong,
    keyboard,
    italic
  } = _ref;
  let currentContent = content;
  function wrap(tag, needed) {
    if (!needed) {
      return;
    }
    currentContent = /*#__PURE__*/React.createElement(tag, {}, currentContent);
  }
  wrap('strong', strong);
  wrap('u', underline);
  wrap('del', del);
  wrap('code', code);
  wrap('mark', mark);
  wrap('kbd', keyboard);
  wrap('i', italic);
  return currentContent;
}
function getNode(dom, defaultNode, needDom) {
  if (dom === true || dom === undefined) {
    return defaultNode;
  }
  return dom || needDom && defaultNode;
}
function toList(val) {
  if (val === false) {
    return [false, false];
  }
  return Array.isArray(val) ? val : [val];
}
const ELLIPSIS_STR = '...';
const Base = /*#__PURE__*/React.forwardRef((props, ref) => {
  var _a, _b, _c;
  const {
      prefixCls: customizePrefixCls,
      className,
      style,
      type,
      disabled,
      children,
      ellipsis,
      editable,
      copyable,
      component,
      title
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "style", "type", "disabled", "children", "ellipsis", "editable", "copyable", "component", "title"]);
  const {
    getPrefixCls,
    direction
  } = React.useContext(_configProvider.ConfigContext);
  const [textLocale] = (0, _useLocale.default)('Text');
  const typographyRef = React.useRef(null);
  const editIconRef = React.useRef(null);
  // ============================ MISC ============================
  const prefixCls = getPrefixCls('typography', customizePrefixCls);
  const textProps = (0, _omit.default)(restProps, ['mark', 'code', 'delete', 'underline', 'strong', 'keyboard', 'italic']);
  // ========================== Editable ==========================
  const [enableEdit, editConfig] = (0, _useMergedConfig.default)(editable);
  const [editing, setEditing] = (0, _useMergedState.default)(false, {
    value: editConfig.editing
  });
  const {
    triggerType = ['icon']
  } = editConfig;
  const triggerEdit = edit => {
    var _a;
    if (edit) {
      (_a = editConfig.onStart) === null || _a === void 0 ? void 0 : _a.call(editConfig);
    }
    setEditing(edit);
  };
  // Focus edit icon when back
  (0, _useUpdatedEffect.default)(() => {
    var _a;
    if (!editing) {
      (_a = editIconRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }
  }, [editing]);
  const onEditClick = e => {
    e === null || e === void 0 ? void 0 : e.preventDefault();
    triggerEdit(true);
  };
  const onEditChange = value => {
    var _a;
    (_a = editConfig.onChange) === null || _a === void 0 ? void 0 : _a.call(editConfig, value);
    triggerEdit(false);
  };
  const onEditCancel = () => {
    var _a;
    (_a = editConfig.onCancel) === null || _a === void 0 ? void 0 : _a.call(editConfig);
    triggerEdit(false);
  };
  // ========================== Copyable ==========================
  const [enableCopy, copyConfig] = (0, _useMergedConfig.default)(copyable);
  const [copied, setCopied] = React.useState(false);
  const copyIdRef = React.useRef(null);
  const copyOptions = {};
  if (copyConfig.format) {
    copyOptions.format = copyConfig.format;
  }
  const cleanCopyId = () => {
    if (copyIdRef.current) {
      clearTimeout(copyIdRef.current);
    }
  };
  const onCopyClick = e => {
    var _a;
    e === null || e === void 0 ? void 0 : e.preventDefault();
    e === null || e === void 0 ? void 0 : e.stopPropagation();
    (0, _copyToClipboard.default)(copyConfig.text || String(children) || '', copyOptions);
    setCopied(true);
    // Trigger tips update
    cleanCopyId();
    copyIdRef.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
    (_a = copyConfig.onCopy) === null || _a === void 0 ? void 0 : _a.call(copyConfig, e);
  };
  React.useEffect(() => cleanCopyId, []);
  // ========================== Ellipsis ==========================
  const [isLineClampSupport, setIsLineClampSupport] = React.useState(false);
  const [isTextOverflowSupport, setIsTextOverflowSupport] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [isJsEllipsis, setIsJsEllipsis] = React.useState(false);
  const [isNativeEllipsis, setIsNativeEllipsis] = React.useState(false);
  const [isNativeVisible, setIsNativeVisible] = React.useState(true);
  const [enableEllipsis, ellipsisConfig] = (0, _useMergedConfig.default)(ellipsis, {
    expandable: false
  });
  const mergedEnableEllipsis = enableEllipsis && !expanded;
  // Shared prop to reduce bundle size
  const {
    rows = 1
  } = ellipsisConfig;
  const needMeasureEllipsis = React.useMemo(() =>
  // Disable ellipsis
  !mergedEnableEllipsis ||
  // Provide suffix
  ellipsisConfig.suffix !== undefined || ellipsisConfig.onEllipsis ||
  // Can't use css ellipsis since we need to provide the place for button
  ellipsisConfig.expandable || enableEdit || enableCopy, [mergedEnableEllipsis, ellipsisConfig, enableEdit, enableCopy]);
  (0, _useLayoutEffect.default)(() => {
    if (enableEllipsis && !needMeasureEllipsis) {
      setIsLineClampSupport((0, _styleChecker.isStyleSupport)('webkitLineClamp'));
      setIsTextOverflowSupport((0, _styleChecker.isStyleSupport)('textOverflow'));
    }
  }, [needMeasureEllipsis, enableEllipsis]);
  const cssEllipsis = React.useMemo(() => {
    if (needMeasureEllipsis) {
      return false;
    }
    if (rows === 1) {
      return isTextOverflowSupport;
    }
    return isLineClampSupport;
  }, [needMeasureEllipsis, isTextOverflowSupport, isLineClampSupport]);
  const isMergedEllipsis = mergedEnableEllipsis && (cssEllipsis ? isNativeEllipsis : isJsEllipsis);
  const cssTextOverflow = mergedEnableEllipsis && rows === 1 && cssEllipsis;
  const cssLineClamp = mergedEnableEllipsis && rows > 1 && cssEllipsis;
  // >>>>> Expand
  const onExpandClick = e => {
    var _a;
    setExpanded(true);
    (_a = ellipsisConfig.onExpand) === null || _a === void 0 ? void 0 : _a.call(ellipsisConfig, e);
  };
  const [ellipsisWidth, setEllipsisWidth] = React.useState(0);
  const [ellipsisFontSize, setEllipsisFontSize] = React.useState(0);
  const onResize = (_ref2, element) => {
    let {
      offsetWidth
    } = _ref2;
    var _a;
    setEllipsisWidth(offsetWidth);
    setEllipsisFontSize(parseInt((_a = window.getComputedStyle) === null || _a === void 0 ? void 0 : _a.call(window, element).fontSize, 10) || 0);
  };
  // >>>>> JS Ellipsis
  const onJsEllipsis = jsEllipsis => {
    var _a;
    setIsJsEllipsis(jsEllipsis);
    // Trigger if changed
    if (isJsEllipsis !== jsEllipsis) {
      (_a = ellipsisConfig.onEllipsis) === null || _a === void 0 ? void 0 : _a.call(ellipsisConfig, jsEllipsis);
    }
  };
  // >>>>> Native ellipsis
  React.useEffect(() => {
    const textEle = typographyRef.current;
    if (enableEllipsis && cssEllipsis && textEle) {
      const currentEllipsis = cssLineClamp ? textEle.offsetHeight < textEle.scrollHeight : textEle.offsetWidth < textEle.scrollWidth;
      if (isNativeEllipsis !== currentEllipsis) {
        setIsNativeEllipsis(currentEllipsis);
      }
    }
  }, [enableEllipsis, cssEllipsis, children, cssLineClamp, isNativeVisible]);
  // https://github.com/ant-design/ant-design/issues/36786
  // Use IntersectionObserver to check if element is invisible
  React.useEffect(() => {
    const textEle = typographyRef.current;
    if (typeof IntersectionObserver === 'undefined' || !textEle || !cssEllipsis || !mergedEnableEllipsis) {
      return;
    }
    /* eslint-disable-next-line compat/compat */
    const observer = new IntersectionObserver(() => {
      setIsNativeVisible(!!textEle.offsetParent);
    });
    observer.observe(textEle);
    return () => {
      observer.disconnect();
    };
  }, [cssEllipsis, mergedEnableEllipsis]);
  // ========================== Tooltip ===========================
  let tooltipProps = {};
  if (ellipsisConfig.tooltip === true) {
    tooltipProps = {
      title: (_a = editConfig.text) !== null && _a !== void 0 ? _a : children
    };
  } else if (/*#__PURE__*/React.isValidElement(ellipsisConfig.tooltip)) {
    tooltipProps = {
      title: ellipsisConfig.tooltip
    };
  } else if (typeof ellipsisConfig.tooltip === 'object') {
    tooltipProps = Object.assign({
      title: (_b = editConfig.text) !== null && _b !== void 0 ? _b : children
    }, ellipsisConfig.tooltip);
  } else {
    tooltipProps = {
      title: ellipsisConfig.tooltip
    };
  }
  const topAriaLabel = React.useMemo(() => {
    const isValid = val => ['string', 'number'].includes(typeof val);
    if (!enableEllipsis || cssEllipsis) {
      return undefined;
    }
    if (isValid(editConfig.text)) {
      return editConfig.text;
    }
    if (isValid(children)) {
      return children;
    }
    if (isValid(title)) {
      return title;
    }
    if (isValid(tooltipProps.title)) {
      return tooltipProps.title;
    }
    return undefined;
  }, [enableEllipsis, cssEllipsis, title, tooltipProps.title, isMergedEllipsis]);
  // =========================== Render ===========================
  // >>>>>>>>>>> Editing input
  if (editing) {
    return /*#__PURE__*/React.createElement(_Editable.default, {
      value: (_c = editConfig.text) !== null && _c !== void 0 ? _c : typeof children === 'string' ? children : '',
      onSave: onEditChange,
      onCancel: onEditCancel,
      onEnd: editConfig.onEnd,
      prefixCls: prefixCls,
      className: className,
      style: style,
      direction: direction,
      component: component,
      maxLength: editConfig.maxLength,
      autoSize: editConfig.autoSize,
      enterIcon: editConfig.enterIcon
    });
  }
  // >>>>>>>>>>> Typography
  // Expand
  const renderExpand = () => {
    const {
      expandable,
      symbol
    } = ellipsisConfig;
    if (!expandable) return null;
    let expandContent;
    if (symbol) {
      expandContent = symbol;
    } else {
      expandContent = textLocale === null || textLocale === void 0 ? void 0 : textLocale.expand;
    }
    return /*#__PURE__*/React.createElement("a", {
      key: "expand",
      className: `${prefixCls}-expand`,
      onClick: onExpandClick,
      "aria-label": textLocale === null || textLocale === void 0 ? void 0 : textLocale.expand
    }, expandContent);
  };
  // Edit
  const renderEdit = () => {
    if (!enableEdit) return;
    const {
      icon,
      tooltip
    } = editConfig;
    const editTitle = (0, _toArray.default)(tooltip)[0] || (textLocale === null || textLocale === void 0 ? void 0 : textLocale.edit);
    const ariaLabel = typeof editTitle === 'string' ? editTitle : '';
    return triggerType.includes('icon') ? (/*#__PURE__*/React.createElement(_tooltip.default, {
      key: "edit",
      title: tooltip === false ? '' : editTitle
    }, /*#__PURE__*/React.createElement(_transButton.default, {
      ref: editIconRef,
      className: `${prefixCls}-edit`,
      onClick: onEditClick,
      "aria-label": ariaLabel
    }, icon || /*#__PURE__*/React.createElement(_EditOutlined.default, {
      role: "button"
    })))) : null;
  };
  // Copy
  const renderCopy = () => {
    if (!enableCopy) return;
    const {
      tooltips,
      icon
    } = copyConfig;
    const tooltipNodes = toList(tooltips);
    const iconNodes = toList(icon);
    const copyTitle = copied ? getNode(tooltipNodes[1], textLocale === null || textLocale === void 0 ? void 0 : textLocale.copied) : getNode(tooltipNodes[0], textLocale === null || textLocale === void 0 ? void 0 : textLocale.copy);
    const systemStr = copied ? textLocale === null || textLocale === void 0 ? void 0 : textLocale.copied : textLocale === null || textLocale === void 0 ? void 0 : textLocale.copy;
    const ariaLabel = typeof copyTitle === 'string' ? copyTitle : systemStr;
    return /*#__PURE__*/React.createElement(_tooltip.default, {
      key: "copy",
      title: copyTitle
    }, /*#__PURE__*/React.createElement(_transButton.default, {
      className: (0, _classnames.default)(`${prefixCls}-copy`, copied && `${prefixCls}-copy-success`),
      onClick: onCopyClick,
      "aria-label": ariaLabel
    }, copied ? getNode(iconNodes[1], /*#__PURE__*/React.createElement(_CheckOutlined.default, null), true) : getNode(iconNodes[0], /*#__PURE__*/React.createElement(_CopyOutlined.default, null), true)));
  };
  const renderOperations = renderExpanded => [renderExpanded && renderExpand(), renderEdit(), renderCopy()];
  const renderEllipsis = needEllipsis => [needEllipsis && (/*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    key: "ellipsis"
  }, ELLIPSIS_STR)), ellipsisConfig.suffix, renderOperations(needEllipsis)];
  return /*#__PURE__*/React.createElement(_rcResizeObserver.default, {
    onResize: onResize,
    disabled: !mergedEnableEllipsis || cssEllipsis
  }, resizeRef => (/*#__PURE__*/React.createElement(_EllipsisTooltip.default, {
    tooltipProps: tooltipProps,
    enabledEllipsis: mergedEnableEllipsis,
    isEllipsis: isMergedEllipsis
  }, /*#__PURE__*/React.createElement(_Typography.default, Object.assign({
    className: (0, _classnames.default)({
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-ellipsis`]: enableEllipsis,
      [`${prefixCls}-single-line`]: mergedEnableEllipsis && rows === 1,
      [`${prefixCls}-ellipsis-single-line`]: cssTextOverflow,
      [`${prefixCls}-ellipsis-multiple-line`]: cssLineClamp
    }, className),
    prefixCls: customizePrefixCls,
    style: Object.assign(Object.assign({}, style), {
      WebkitLineClamp: cssLineClamp ? rows : undefined
    }),
    component: component,
    ref: (0, _ref3.composeRef)(resizeRef, typographyRef, ref),
    direction: direction,
    onClick: triggerType.includes('text') ? onEditClick : undefined,
    "aria-label": topAriaLabel === null || topAriaLabel === void 0 ? void 0 : topAriaLabel.toString(),
    title: title
  }, textProps), /*#__PURE__*/React.createElement(_Ellipsis.default, {
    enabledMeasure: mergedEnableEllipsis && !cssEllipsis,
    text: children,
    rows: rows,
    width: ellipsisWidth,
    fontSize: ellipsisFontSize,
    onEllipsis: onJsEllipsis
  }, (node, needEllipsis) => {
    let renderNode = node;
    if (node.length && needEllipsis && topAriaLabel) {
      renderNode = /*#__PURE__*/React.createElement("span", {
        key: "show-content",
        "aria-hidden": true
      }, renderNode);
    }
    const wrappedContext = wrapperDecorations(props, /*#__PURE__*/React.createElement(React.Fragment, null, renderNode, renderEllipsis(needEllipsis)));
    return wrappedContext;
  })))));
});
var _default = exports.default = Base;