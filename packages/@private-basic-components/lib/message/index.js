"use strict";
"use client";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.actWrapper = exports.actDestroy = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var React = _interopRequireWildcard(require("react"));
var _render = require("rc-util/lib/React/render");
var _configProvider = _interopRequireWildcard(require("../config-provider"));
var _PurePanel = _interopRequireDefault(require("./PurePanel"));
var _useMessage = _interopRequireWildcard(require("./useMessage"));
var _util = require("./util");
let message = null;
let act = callback => callback();
let taskQueue = [];
let defaultGlobalConfig = {};
function getGlobalContext() {
  const {
    prefixCls: globalPrefixCls,
    getContainer: globalGetContainer,
    duration,
    rtl,
    maxCount,
    top
  } = defaultGlobalConfig;
  const mergedPrefixCls = globalPrefixCls !== null && globalPrefixCls !== void 0 ? globalPrefixCls : (0, _configProvider.globalConfig)().getPrefixCls('message');
  const mergedContainer = (globalGetContainer === null || globalGetContainer === void 0 ? void 0 : globalGetContainer()) || document.body;
  return {
    prefixCls: mergedPrefixCls,
    getContainer: () => mergedContainer,
    duration,
    rtl,
    maxCount,
    top
  };
}
const GlobalHolder = /*#__PURE__*/React.forwardRef((_, ref) => {
  const [messageConfig, setMessageConfig] = React.useState(getGlobalContext);
  const [api, holder] = (0, _useMessage.useInternalMessage)(messageConfig);
  const global = (0, _configProvider.globalConfig)();
  const rootPrefixCls = global.getRootPrefixCls();
  const rootIconPrefixCls = global.getIconPrefixCls();
  const theme = global.getTheme();
  const sync = () => {
    setMessageConfig(getGlobalContext);
  };
  React.useEffect(sync, []);
  React.useImperativeHandle(ref, () => {
    const instance = Object.assign({}, api);
    Object.keys(instance).forEach(method => {
      instance[method] = function () {
        sync();
        return api[method].apply(api, arguments);
      };
    });
    return {
      instance,
      sync
    };
  });
  return /*#__PURE__*/React.createElement(_configProvider.default, {
    prefixCls: rootPrefixCls,
    iconPrefixCls: rootIconPrefixCls,
    theme: theme
  }, holder);
});
function flushNotice() {
  if (!message) {
    const holderFragment = document.createDocumentFragment();
    const newMessage = {
      fragment: holderFragment
    };
    message = newMessage;
    // Delay render to avoid sync issue
    act(() => {
      (0, _render.render)(/*#__PURE__*/React.createElement(GlobalHolder, {
        ref: node => {
          const {
            instance,
            sync
          } = node || {};
          // React 18 test env will throw if call immediately in ref
          Promise.resolve().then(() => {
            if (!newMessage.instance && instance) {
              newMessage.instance = instance;
              newMessage.sync = sync;
              flushNotice();
            }
          });
        }
      }), holderFragment);
    });
    return;
  }
  // Notification not ready
  if (!message.instance) {
    return;
  }
  // >>> Execute task
  taskQueue.forEach(task => {
    const {
      type,
      skipped
    } = task;
    // Only `skipped` when user call notice but cancel it immediately
    // and instance not ready
    if (!skipped) {
      switch (type) {
        case 'open':
          {
            act(() => {
              const closeFn = message.instance.open(Object.assign(Object.assign({}, defaultGlobalConfig), task.config));
              closeFn === null || closeFn === void 0 ? void 0 : closeFn.then(task.resolve);
              task.setCloseFn(closeFn);
            });
            break;
          }
        case 'destroy':
          act(() => {
            message === null || message === void 0 ? void 0 : message.instance.destroy(task.key);
          });
          break;
        // Other type open
        default:
          {
            act(() => {
              var _message$instance;
              const closeFn = (_message$instance = message.instance)[type].apply(_message$instance, (0, _toConsumableArray2.default)(task.args));
              closeFn === null || closeFn === void 0 ? void 0 : closeFn.then(task.resolve);
              task.setCloseFn(closeFn);
            });
          }
      }
    }
  });
  // Clean up
  taskQueue = [];
}
// ==============================================================================
// ==                                  Export                                  ==
// ==============================================================================
function setMessageGlobalConfig(config) {
  defaultGlobalConfig = Object.assign(Object.assign({}, defaultGlobalConfig), config);
  // Trigger sync for it
  act(() => {
    var _a;
    (_a = message === null || message === void 0 ? void 0 : message.sync) === null || _a === void 0 ? void 0 : _a.call(message);
  });
}
function open(config) {
  const result = (0, _util.wrapPromiseFn)(resolve => {
    let closeFn;
    const task = {
      type: 'open',
      config,
      resolve,
      setCloseFn: fn => {
        closeFn = fn;
      }
    };
    taskQueue.push(task);
    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });
  flushNotice();
  return result;
}
function typeOpen(type, args) {
  // Warning if exist theme
  if (process.env.NODE_ENV !== 'production') {
    (0, _configProvider.warnContext)('message');
  }
  const result = (0, _util.wrapPromiseFn)(resolve => {
    let closeFn;
    const task = {
      type,
      args,
      resolve,
      setCloseFn: fn => {
        closeFn = fn;
      }
    };
    taskQueue.push(task);
    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });
  flushNotice();
  return result;
}
function destroy(key) {
  taskQueue.push({
    type: 'destroy',
    key
  });
  flushNotice();
}
const methods = ['success', 'info', 'warning', 'error', 'loading'];
const baseStaticMethods = {
  open,
  destroy,
  config: setMessageGlobalConfig,
  useMessage: _useMessage.default,
  _InternalPanelDoNotUseOrYouWillBeFired: _PurePanel.default
};
const staticMethods = baseStaticMethods;
methods.forEach(type => {
  staticMethods[type] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return typeOpen(type, args);
  };
});
// ==============================================================================
// ==                                   Test                                   ==
// ==============================================================================
const noop = () => {};
/** @internal Only Work in test env */
// eslint-disable-next-line import/no-mutable-exports
let actWrapper = exports.actWrapper = noop;
if (process.env.NODE_ENV === 'test') {
  exports.actWrapper = actWrapper = wrapper => {
    act = wrapper;
  };
}
/** @internal Only Work in test env */
// eslint-disable-next-line import/no-mutable-exports
let actDestroy = exports.actDestroy = noop;
if (process.env.NODE_ENV === 'test') {
  exports.actDestroy = actDestroy = () => {
    message = null;
  };
}
var _default = exports.default = staticMethods;