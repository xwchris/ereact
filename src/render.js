import { TEXT_ELEMENT, SYNC_RENDER } from './constants';
import { buildComponent, updateComponent } from './component';
import { isArray, flatten } from './utils';

// render
const render = (element, containerDom) => {
  reconcile(containerDom, null, element, {});
}

// createElement
const createElement = (type, initProps, ...args) => {
  const props = Object.assign({}, initProps);
  const rawChildren = [].concat(...args);
  const children = rawChildren
    .filter(child => child != null && typeof child !== 'boolean')
    .map(child => child instanceof Object ? child : createTextElement(child));

  props.children = children;
  return { type, props, children };
}

const createTextElement = text => {
  return {
    type: TEXT_ELEMENT,
    props: { nodeValue: text },
  }
}

const createNode = (element, context) => {
  const { type, props } = element;
  const isTextElement = type === TEXT_ELEMENT;
  const isComponent = typeof type === 'function';

  if (isComponent) {
    return buildComponent(element, context);
  }

  const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
  const childNodes = reconcileChildren({ dom }, element, context);
  updateProperties(dom, {}, props);

  return { dom, element, childNodes };
}

const reconcile = (parentDom, oldNode, element, context) => {
  if (oldNode == null) {
    if (isArray(element)) {
      const node = element.map(createNode);
      node.forEach(n => {
        parentDom.appendChild(n.dom);
      })
    }

    const node = createNode(element, context);

    if (isArray(node.dom)) {
      const doms = flatten(node.dom);
      doms.forEach(dom => parentDom.appendChild(dom));
    } else if (node.dom) {
      parentDom.appendChild(node.dom);
    }
    return node;
  } else if (element == null) {
    if (isArray(oldNode)) {
      oldNode.forEach(n => {
        parentDom.removeChild(n.dom);
      })
    } else if (oldNode.dom) {
      parentDom.removeChild(oldNode.dom);
    }
    return null;
  } else if (isArray(oldNode) && isArray(element)) {
    return reconcileChildren({ dom: parentDom, childNodes: oldNode }, { props: { children: element } }, context);
  } else if ((oldNode.element || {}).type !== element.type) {
    const node = createNode(element, context);

    if (oldNode.element && typeof oldNode.element.type === 'function' && typeof oldNode.instance.componentWillUnmount === 'function') {
      oldNode.instance.componentWillUnmount();
    }

    if (oldNode.dom || oldNode[0].dom) {
      parentDom.replaceChild(node.dom, oldNode.dom || oldNode[0].dom);
    }
    return node;
  } else if (typeof element.type === 'string') {
    oldNode.childNodes = reconcileChildren(oldNode, element, context);
    updateProperties(oldNode.dom, oldNode.element.props, element.props);
    oldNode.element = element;
    return oldNode;
  } else {
    return updateComponent(SYNC_RENDER, parentDom, oldNode, element, context, true);
  }
}

const reconcileChildren = (oldNode, element, context) => {
  const oldChildNodes = (oldNode.childNodes || []).filter(node => node != null);
  const childElements = (element.props.children || []).filter(node => node != null);
  const childNodes = [];
  const length = Math.max(oldChildNodes.length, childElements.length);
  for (let i = 0; i < length; i++) {
    const childNode = reconcile(oldNode.dom, oldChildNodes[i], childElements[i], context);
    childNodes.push(childNode);
  }
  return childNodes;
}

const updateProperties = (dom, oldProps, props) => {
  for (name in oldProps) {
    if (props[name] == null) {
      setAccessor(dom, name, undefined);
    }
  }

  for (name in props) {
    // fix: name === 'value' || name === 'checked' ? dom[name] : oldProps[name]
    if (props[name] !== oldProps[name]) {
      setAccessor(dom, name, props[name]);
    }
  }
}

const setAccessor = (dom, name, value) => {
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

function eventProxy(e) {
  return this._listener[e.type](e);
}

export { createElement, render, reconcile, createNode, reconcileChildren };
