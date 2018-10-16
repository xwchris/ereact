import { buildComponentFromVNode } from './component';
import { ATTR_KEY } from './constants';

/**
 * Reconciliation method
 *
 * @param { dom } dom given dom
 * @param { VNode } vnode vnode to diff
 * @param { dom } parent the dom vnode need to mount
 *
 * @return the result dom
 */

const diff = (dom, vnode, parent, context) => {

  const rdom = idiff(dom, vnode, context);

  if (parent && rdom.parentNode !== parent) {
    parent.appendChild(rdom);
  }
  return rdom;
}

/**
 * Internal reconciliation method
 *
 * @param { dom } dom given dom
 * @param { VNode } vnode vnode to diff
 *
 * @return { dom } result dom
 */

const idiff = (dom, vnode, context) => {
  let out = dom;

  if (vnode == null || typeof vnode === 'boolean') {
    vnode = ''
  }

  // update or create a node
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.parentNode && dom.nodeType === 3) {
      if (dom.nodeValue !== vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) dom.parentNode.replaceChild(out, dom);
    }
    return out;
  }

  if (typeof vnode.type === 'function') {
    return buildComponentFromVNode(dom, vnode, context);
  }

  if (!dom || dom.nodeName.toLowerCase() !== vnode.type) {
    out = document.createElement(vnode.type);
    if (dom) {
      while (dom.firstChild) out.appendChild(dom.firstChild);
      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    }
  }

  // these two functions can't swap position
  // because diffAttributes may set dangerouslySetInnerHTML which can change the structure
  diffChildren(out, vnode.children, context);
  diffAttribute(out, vnode.attributes);

  return out;
}

/**
 * Diff attributes
 *
 * @param { dom } dom dom to diff
 * @param { object } attrs attributes need to diff
 */

const diffAttribute = (dom, attrs) => {
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
 * Diff children
 *
 * @param {dom} dom dom to diff
 * @param {array} children vnode children
 */

const diffChildren = (dom, children, context) => {
  const originChildren = dom.childNodes;
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const originChild = originChildren[i];
    const child = children[i];
    const resultChild = idiff(originChild, child, context);

    if (originChild !== resultChild) {
      if (originChild == null) {
        dom.appendChild(resultChild);
      } else {
        dom.replaceChild(resultChild, originChild);
      }
    }
  }

  if ((originChildren && originChildren.length) > length) {
    for (let i = originChildren.length - 1; i >= length; i--) {
      dom.removeChild(originChildren[i]);
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
