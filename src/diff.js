import { buildComponentFromVNode } from './component';

/**
 * apply differences to vnode with a given dom
 *
 * @param { dom } dom - given dom
 * @param { VNode } vnode - vnode to diff
 * @param { dom } parent - the dom vnode need to mount
 */

const diff = (dom, vnode, parent) => {

  const rdom = idiff(dom, vnode);

  if (parent && rdom.parentNode !== parent) {
    parent.appendChild(rdom);
  }
  return rdom;
}

/**
 * internal diff
 *
 * @param { dom } dom - given dom
 * @param { VNode } vnode - vnode to diff
 *
 * @return { dom } result dom
 */

export const idiff = (dom, vnode) => {
  let out = dom;

  if (vnode == null || typeof vnode === 'boolean') {
    vnode = ''
  }

  // update or create a node
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.parentNode && dom.nodeType === 3) {
      dom.nodeValue = vnode;
    } else {
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) dom.parentNode.replaceChild(out, dom);
    }
    return out;
  }

  if (typeof vnode.type === 'function') {
    return buildComponentFromVNode(dom, vnode);
  }

  if (!dom || dom.nodeName.toLowerCase() !== vnode.type) {
    out = document.createElement(vnode.type);
    if (dom) {
      while (dom.firstChild) out.appendChild(dom.firstChild);
      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    }
  }

  diffAttribute(out, vnode.attributes);
  diffChildren(out, vnode.children);

  return out;
}

/**
 * diff attributes
 *
 * @param { dom } dom
 * @param { object } attributes - attributes need to diff
 */

const diffAttribute = (dom, attributes) => {
  for (let i = 0; i < dom.attributes; i++) {
    const name = dom.attributes[i];
    setAccessor(dom, name, undefined);
  }

  for (let name in attributes) {
    setAccessor(dom, name, attributes[name]);
  }
}

/**
 * compare children
 *
 * @param {dom} dom dom to compare
 * @param {array} children vnode children
 */
const diffChildren = (dom, children) => {
  const originChildren = dom.childNodes;
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const originChild = originChildren[i];
    const child = children[i];
    const resultChild = idiff(originChild, child);

    if (originChild) {
      dom.replaceChild(originChild, resultChild);
    } else {
      dom.appendChild(resultChild);
    }
  }

  if (originChildren.length > length) {
    for (let i = originChildren.length - 1; i >= length; i--) {
      dom.removeChild(originChildren[i]);
    }
  }
}

/**
 * set dom attribute
 *
 * @param {dom} dom target dom
 * @param {string} name the property name
 * @param {any} value the property value
 */
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
  } else if (name === 'ref' && value != null) {
    if (typeof value === 'function') {
      value(dom);
    } else {
      // TODO: this is not right
      value.current = dom;
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
  return this._listener[e.type]();
}

export default diff;
