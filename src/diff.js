'use strict';

import { buildComponent } from './component';
import { ATTR_KEY, TEXT_ELEMENT } from './constants';

const createNode = element => {
  const type = element.type;
  const isTextElement = element.type === TEXT_ELEMENT;

  const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
  return ({ dom, element, childNodes: [] });
}

const diff = (oldNode = {}, element, parent, context) => {
  idiff(oldNode, element, parent, context);
  return parent;
}

const idiff = (oldNode, element, parentDom, context) => {
  let node = oldNode;

  if (element && typeof element.type === 'function') {
    return buildComponent(oldNode || {}, element, parentDom, context);
  }

  if (oldNode == null || oldNode.element == null || oldNode.element.type !== element.type) {
    node = createNode(element);
    const oldDom = oldNode && oldNode.dom;
    const dom = node.dom;

    if (oldDom) {

      // 为了避免创建多余的节点
      while (oldDom.firstChild) dom.appendChild(oldDom.firstChild);
      if (parentDom) parentDom.replaceChild(dom, oldDom);
      node.dom = dom;
    } else {
      parentDom.appendChild(dom);
    }
  } else if (element == null && parentDom) {
    parentDom.removeChild(oldNode.dom);
  }

  // these two functions can't swap position
  // because diffAttributes may set dangerouslySetInnerHTML which can change the structure
  const oldChildNodes = oldNode && oldNode.childNodes || [];
  const childNodes = diffChildren(oldChildNodes, element.children, node.dom, context);

  node.childNodes = childNodes;

  diffAttributes(node.dom, element.attributes);

  return node;
}

const diffChildren = (oldChildNodes = [], children = [], parentDom, context) => {
  const childNodes = [];
  const length = Math.max(oldChildNodes.length, children.length);
  for (let i = 0; i < length; i++) {
    const childNode = idiff(oldChildNodes[i], children[i], parentDom, context);
    childNodes.push(childNode);
  }
  return childNodes;
}

const diffAttributes = (dom, attrs) => {
  const oldAttrs = dom[ATTR_KEY] || {};

  for (name in oldAttrs) {
    if (!(attrs && attrs[name] != null) && oldAttrs[name] != null) {
      setAccessor(dom, name, undefined);
    }
  }

  for (name in attrs) {
    if (!(name in oldAttrs) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : oldAttrs[name])) {
      setAccessor(dom, name, attrs[name]);
    }
  }
}


/**
 * Set dom attribute
 *
 * @param {dom} dom target dom
 * @param {string} name the property name
 * @param {any} value the property value
 *
 */
// TODO: 测试属性设置
const setAccessor = (dom, name, value) => {
  dom[ATTR_KEY] = dom[ATTR_KEY] || {};
  if (value != null) {
    dom[ATTR_KEY][name] = value;
  }

  // className htmlFor
  if (name === 'className') {
    name = 'class';
  }

  if (name === 'htmlFor') {
    name = 'for';
  }

  if (name === 'key' || name === 'children' || name === 'innerHTML') {
    // ignore
  } else if (name === 'nodeValue') {
    dom.nodeValue = value;
  } else if (name === 'ref' && value != null) {
    if (typeof value === 'function') {
      value(dom);
    } else {
      console.error('ref should be an function');
    }
  } else if (name === 'style') {
    if (typeof value === 'object') {
      for (let i in value) {
        dom.style[i] = typeof value[i] === 'number' ? `${value[i]}px` : value[i];
      }
    }

    if (typeof value === 'string' || value == null) {
      dom.style = value;
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (typeof value === 'object') {
      dom.innerHTML = value.__html;
    }
  } else if (name.startsWith('on')) {
    const useCapture = name.endsWith('Capture');
    const eventType = name.toLowerCase().substring(2);
    if (value) {
      dom.addEventListener(eventType, eventProxy, useCapture);
    } else {
      dom.removeEventListener(eventType, eventProxy, useCapture);
    }
    (dom._listener || (dom._listener = {}))[eventType] = value;
  } else {
    dom.setAttribute(name, value);
  }
}

/**
 * event proxy
 *
 * @param {event} e event
 */
function eventProxy(e) {
  return this._listener[e.type](e);
}

export { diff, idiff, diffChildren };
