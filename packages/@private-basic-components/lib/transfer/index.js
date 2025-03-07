"use strict";
"use client";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _react = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _statusUtils = require("../_util/statusUtils");
var _transKeys = require("../_util/transKeys");
var _warning = require("../_util/warning");
var _configProvider = require("../config-provider");
var _defaultRenderEmpty = _interopRequireDefault(require("../config-provider/defaultRenderEmpty"));
var _context = require("../form/context");
var _locale = require("../locale");
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _useData = _interopRequireDefault(require("./hooks/useData"));
var _useSelection = _interopRequireDefault(require("./hooks/useSelection"));
var _list = _interopRequireDefault(require("./list"));
var _operation = _interopRequireDefault(require("./operation"));
var _search = _interopRequireDefault(require("./search"));
var _style = _interopRequireDefault(require("./style"));
const Transfer = props => {
  const {
    dataSource,
    targetKeys = [],
    selectedKeys,
    selectAllLabels = [],
    operations = [],
    style = {},
    listStyle = {},
    locale = {},
    titles,
    disabled,
    showSearch = false,
    operationStyle,
    showSelectAll,
    oneWay,
    pagination,
    status: customStatus,
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    selectionsIcon,
    filterOption,
    render,
    footer,
    children,
    rowKey,
    onScroll,
    onChange,
    onSearch,
    onSelectChange
  } = props;
  const {
    getPrefixCls,
    renderEmpty,
    direction: dir,
    transfer
  } = (0, _react.useContext)(_configProvider.ConfigContext);
  const prefixCls = getPrefixCls('transfer', customizePrefixCls);
  const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
  // Fill record with `key`
  const [mergedDataSource, leftDataSource, rightDataSource] = (0, _useData.default)(dataSource, rowKey, targetKeys);
  // Get direction selected keys
  const [
  // Keys
  sourceSelectedKeys, targetSelectedKeys,
  // Setters
  setSourceSelectedKeys, setTargetSelectedKeys] = (0, _useSelection.default)(leftDataSource, rightDataSource, selectedKeys);
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Transfer');
    process.env.NODE_ENV !== "production" ? warning(!pagination || !children, 'usage', '`pagination` not support customize render list.') : void 0;
  }
  const setStateKeys = (0, _react.useCallback)((direction, keys) => {
    if (direction === 'left') {
      const nextKeys = typeof keys === 'function' ? keys(sourceSelectedKeys || []) : keys;
      setSourceSelectedKeys(nextKeys);
    } else {
      const nextKeys = typeof keys === 'function' ? keys(targetSelectedKeys || []) : keys;
      setTargetSelectedKeys(nextKeys);
    }
  }, [sourceSelectedKeys, targetSelectedKeys]);
  const handleSelectChange = (0, _react.useCallback)((direction, holder) => {
    if (direction === 'left') {
      onSelectChange === null || onSelectChange === void 0 ? void 0 : onSelectChange(holder, targetSelectedKeys);
    } else {
      onSelectChange === null || onSelectChange === void 0 ? void 0 : onSelectChange(sourceSelectedKeys, holder);
    }
  }, [sourceSelectedKeys, targetSelectedKeys]);
  const getTitles = transferLocale => {
    var _a;
    return (_a = titles !== null && titles !== void 0 ? titles : transferLocale.titles) !== null && _a !== void 0 ? _a : [];
  };
  const handleLeftScroll = e => {
    onScroll === null || onScroll === void 0 ? void 0 : onScroll('left', e);
  };
  const handleRightScroll = e => {
    onScroll === null || onScroll === void 0 ? void 0 : onScroll('right', e);
  };
  const moveTo = direction => {
    const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
    const dataSourceDisabledKeysMap = (0, _transKeys.groupDisabledKeysMap)(mergedDataSource);
    // filter the disabled options
    const newMoveKeys = moveKeys.filter(key => !dataSourceDisabledKeysMap.has(key));
    const newMoveKeysMap = (0, _transKeys.groupKeysMap)(newMoveKeys);
    // move items to target box
    const newTargetKeys = direction === 'right' ? newMoveKeys.concat(targetKeys) : targetKeys.filter(targetKey => !newMoveKeysMap.has(targetKey));
    // empty checked keys
    const oppositeDirection = direction === 'right' ? 'left' : 'right';
    setStateKeys(oppositeDirection, []);
    handleSelectChange(oppositeDirection, []);
    onChange === null || onChange === void 0 ? void 0 : onChange(newTargetKeys, direction, newMoveKeys);
  };
  const moveToLeft = () => {
    moveTo('left');
  };
  const moveToRight = () => {
    moveTo('right');
  };
  const onItemSelectAll = (direction, keys, checkAll) => {
    setStateKeys(direction, prevKeys => {
      let mergedCheckedKeys = [];
      if (checkAll === 'replace') {
        mergedCheckedKeys = keys;
      } else if (checkAll) {
        // Merge current keys with origin key
        mergedCheckedKeys = Array.from(new Set([].concat((0, _toConsumableArray2.default)(prevKeys), (0, _toConsumableArray2.default)(keys))));
      } else {
        const selectedKeysMap = (0, _transKeys.groupKeysMap)(keys);
        // Remove current keys from origin keys
        mergedCheckedKeys = prevKeys.filter(key => !selectedKeysMap.has(key));
      }
      handleSelectChange(direction, mergedCheckedKeys);
      return mergedCheckedKeys;
    });
  };
  const onLeftItemSelectAll = (keys, checkAll) => {
    onItemSelectAll('left', keys, checkAll);
  };
  const onRightItemSelectAll = (keys, checkAll) => {
    onItemSelectAll('right', keys, checkAll);
  };
  const leftFilter = e => onSearch === null || onSearch === void 0 ? void 0 : onSearch('left', e.target.value);
  const rightFilter = e => onSearch === null || onSearch === void 0 ? void 0 : onSearch('right', e.target.value);
  const handleLeftClear = () => onSearch === null || onSearch === void 0 ? void 0 : onSearch('left', '');
  const handleRightClear = () => onSearch === null || onSearch === void 0 ? void 0 : onSearch('right', '');
  const onItemSelect = (direction, selectedKey, checked) => {
    const holder = (0, _toConsumableArray2.default)(direction === 'left' ? sourceSelectedKeys : targetSelectedKeys);
    const index = holder.indexOf(selectedKey);
    if (index > -1) {
      holder.splice(index, 1);
    }
    if (checked) {
      holder.push(selectedKey);
    }
    handleSelectChange(direction, holder);
    if (!props.selectedKeys) {
      setStateKeys(direction, holder);
    }
  };
  const onLeftItemSelect = (selectedKey, checked) => {
    onItemSelect('left', selectedKey, checked);
  };
  const onRightItemSelect = (selectedKey, checked) => {
    onItemSelect('right', selectedKey, checked);
  };
  const onRightItemRemove = keys => {
    setStateKeys('right', []);
    onChange === null || onChange === void 0 ? void 0 : onChange(targetKeys.filter(key => !keys.includes(key)), 'left', (0, _toConsumableArray2.default)(keys));
  };
  const handleListStyle = direction => {
    if (typeof listStyle === 'function') {
      return listStyle({
        direction
      });
    }
    return listStyle || {};
  };
  const formItemContext = (0, _react.useContext)(_context.FormItemInputContext);
  const {
    hasFeedback,
    status
  } = formItemContext;
  const getLocale = transferLocale => Object.assign(Object.assign(Object.assign({}, transferLocale), {
    notFoundContent: (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty('Transfer')) || /*#__PURE__*/_react.default.createElement(_defaultRenderEmpty.default, {
      componentName: "Transfer"
    })
  }), locale);
  const mergedStatus = (0, _statusUtils.getMergedStatus)(status, customStatus);
  const mergedPagination = !children && pagination;
  const leftActive = targetSelectedKeys.length > 0;
  const rightActive = sourceSelectedKeys.length > 0;
  const cls = (0, _classnames.default)(prefixCls, {
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-customize-list`]: !!children,
    [`${prefixCls}-rtl`]: dir === 'rtl'
  }, (0, _statusUtils.getStatusClassNames)(prefixCls, mergedStatus, hasFeedback), transfer === null || transfer === void 0 ? void 0 : transfer.className, className, rootClassName, hashId);
  const [contextLocale] = (0, _locale.useLocale)('Transfer', _en_US.default.Transfer);
  const listLocale = getLocale(contextLocale);
  const [leftTitle, rightTitle] = getTitles(listLocale);
  return wrapSSR(/*#__PURE__*/_react.default.createElement("div", {
    className: cls,
    style: Object.assign(Object.assign({}, transfer === null || transfer === void 0 ? void 0 : transfer.style), style)
  }, /*#__PURE__*/_react.default.createElement(_list.default, Object.assign({
    prefixCls: `${prefixCls}-list`,
    titleText: leftTitle,
    dataSource: leftDataSource,
    filterOption: filterOption,
    style: handleListStyle('left'),
    checkedKeys: sourceSelectedKeys,
    handleFilter: leftFilter,
    handleClear: handleLeftClear,
    onItemSelect: onLeftItemSelect,
    onItemSelectAll: onLeftItemSelectAll,
    render: render,
    showSearch: showSearch,
    renderList: children,
    footer: footer,
    onScroll: handleLeftScroll,
    disabled: disabled,
    direction: dir === 'rtl' ? 'right' : 'left',
    showSelectAll: showSelectAll,
    selectAllLabel: selectAllLabels[0],
    pagination: mergedPagination,
    selectionsIcon: selectionsIcon
  }, listLocale)), /*#__PURE__*/_react.default.createElement(_operation.default, {
    className: `${prefixCls}-operation`,
    rightActive: rightActive,
    rightArrowText: operations[0],
    moveToRight: moveToRight,
    leftActive: leftActive,
    leftArrowText: operations[1],
    moveToLeft: moveToLeft,
    style: operationStyle,
    disabled: disabled,
    direction: dir,
    oneWay: oneWay
  }), /*#__PURE__*/_react.default.createElement(_list.default, Object.assign({
    prefixCls: `${prefixCls}-list`,
    titleText: rightTitle,
    dataSource: rightDataSource,
    filterOption: filterOption,
    style: handleListStyle('right'),
    checkedKeys: targetSelectedKeys,
    handleFilter: rightFilter,
    handleClear: handleRightClear,
    onItemSelect: onRightItemSelect,
    onItemSelectAll: onRightItemSelectAll,
    onItemRemove: onRightItemRemove,
    render: render,
    showSearch: showSearch,
    renderList: children,
    footer: footer,
    onScroll: handleRightScroll,
    disabled: disabled,
    direction: dir === 'rtl' ? 'left' : 'right',
    showSelectAll: showSelectAll,
    selectAllLabel: selectAllLabels[1],
    showRemove: oneWay,
    pagination: mergedPagination,
    selectionsIcon: selectionsIcon
  }, listLocale))));
};
if (process.env.NODE_ENV !== 'production') {
  Transfer.displayName = 'Transfer';
}
Transfer.List = _list.default;
Transfer.Search = _search.default;
Transfer.Operation = _operation.default;
var _default = exports.default = Transfer;