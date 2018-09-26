/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "static";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createElement = __webpack_require__(/*! ./src/createElement */ "./src/createElement.js");

var _createElement2 = _interopRequireDefault(_createElement);

var _render = __webpack_require__(/*! ./src/render */ "./src/render.js");

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _render2.default)((0, _createElement2.default)(
  'div',
  { className: 'container' },
  (0, _createElement2.default)(
    'h1',
    null,
    'hello world'
  )
), document.getElementById('root'));

/***/ }),

/***/ "./src/createElement.js":
/*!******************************!*\
  !*** ./src/createElement.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * vnode constructor
 */
function VNode() {}

/**
 * create vnode
 *
 * @param { string | function } type
 * @param { object } attributes
 * @param { Array(VNode) } children
 *
 * @return { VNode } vnode
 */

var createElement = function createElement(type, attributes) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var _ref;

  // shallow copy attribute
  var clonedAttributes = Object.assign({}, attributes);

  // flatten children and filter children
  var filteredChildren = (_ref = []).concat.apply(_ref, children);

  // create and assign vnode
  var vnode = new VNode();

  vnode.type = type;
  vnode.attributes = clonedAttributes;
  vnode.children = filteredChildren;

  return vnode;
};

exports.default = createElement;

/***/ }),

/***/ "./src/diff.js":
/*!*********************!*\
  !*** ./src/diff.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * apply differences to vnode with a given dom
 *
 * @param { dom } dom - given dom
 * @param { VNode } vnode - vnode to diff
 * @param { dom } parent - the dom vnode need to mount
 */

var diff = function diff(dom, vnode, parent) {

  var rdom = idiff(dom, vnode);

  if (parent && rdom.parentNode !== parent) {
    parent.appendChild(parent);
  }
};

/**
 * internal diff
 *
 * @param { dom } dom - given dom
 * @param { VNode } vnode - vnode to diff
 *
 * @return { dom } result dom
 */

var idiff = function idiff(dom, vnode) {
  var out = dom;

  if (vnode == null || typeof vnode === 'boolean') {
    vnode = '';
  }

  // update or create a node
  if (vnode === 'string') {
    if (dom && dom.parentNode && dom.nodeType === 3) {
      dom.nodeValue = vnode;
    } else {
      var _out = document.createTextNode(vnode);
      if (dom && dom.parentNode) dom.parentNode.replaceChild(_out, dom);
    }
    return out;
  }

  if (!dom || dom.nodeName.toLowerCase() !== vnode.type) {
    out = document.createElement(vnode.type);
    if (dom) {
      while (dom.firstChild) {
        out.appendChild(dom.firstChild);
      }if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    }
  }

  diffAttribute(out, vnode.attributes);
  diffChildren(out, vnode.children);

  return out;
};

/**
 * diff attributes
 *
 * @param { dom } dom
 * @param { object } attributes - attributes need to diff
 */

var diffAttribute = function diffAttribute(dom, attributes) {
  var newAttrs = Object.keys(attributes).filter(function (attr) {
    return attr !== 'children';
  });
  var oldAttrs = Object.keys(dom.attributes);

  var attrs = (0, _utils.uniq)([].concat(_toConsumableArray(oldAttrs), _toConsumableArray(newAttrs)));

  attrs.forEach(function (attr) {
    if (attr in dom && !attr in attributes) {
      dom.removeAttribute(attr);
    } else {
      dom.setAttribute(attr, attributes[attr]);
    }
  });
};

var diffChildren = function diffChildren(dom, children) {
  var originChildren = dom.children;
  var length = children.length;
  for (var i = 0; i < length; i++) {
    var originChild = originChildren[i];
    var child = children[i];
    var resultChild = idiff(originChild, child);

    if (originChild) {
      dom.replaceChild(originChild, resultChild);
    } else {
      dom.appendChild(resultChild);
    }
  }

  if (originChildren.length > length) {
    for (var _i = originChildren.length - 1; _i >= length; _i--) {
      dom.removeChild(originChildren[_i]);
    }
  }
};

exports.default = diff;

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _diff = __webpack_require__(/*! ./diff */ "./src/diff.js");

var _diff2 = _interopRequireDefault(_diff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = function render(vnode, container) {
  (0, _diff2.default)(null, vnode, container);
};

exports.default = render;

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniq = uniq;
/**
 * remove the same element in array
 *
 * @param { Array } array the array to be dealed
 */

function uniq(array) {
  return array.reverse().filter(function (item, index) {
    return array.lastIndexOf(item) === index;
  }).reverse();
}

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map