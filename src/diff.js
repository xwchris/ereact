import { uniq } from './utils';

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
    parent.appendChild(parent);
  }
}

/**
 * internal diff
 *
 * @param { dom } dom - given dom
 * @param { VNode } vnode - vnode to diff
 *
 * @return { dom } result dom
 */

const idiff = (dom, vnode) => {
  let out = dom;

  if (vnode == null || typeof vnode === 'boolean') {
    vnode = ''
  }

  // update or create a node
  if (vnode === 'string') {

    if (dom.nodeType === 3 && dom.parentNode) {
      dom.nodeValue = vnode;
    } else {
      const out = document.createTextNode(vnode);
      dom.parentNode.replaceChild(out, dom);
    }

    return out;
  }

  if (typeof vnode === 'function') {}

  if (!dom || dom.nodeName.toLowerCase() === vnode.type) {
    out = document.createElement(vnode.type);

    if (dom) {
      dom.parentNode.replaceChild(out, dom);
    }
  }

  diffAttribute(out, vnode.attributes);

  // diffChildren(dom, vnode);
}

/**
 * diff attributes
 *
 * @param { dom } dom
 * @param { object } attributes - attributes need to diff
 */

const diffAttribute = (dom, attributes) => {
  const newAttrs = Object.keys(attributes).filter(attr => attr !== 'children');
  const oldAttrs = Object.keys(dom.attributes);

  const attrs = uniq([...oldAttrs, ...newAttrs]);

  attrs.forEach(attr => {
    if (attr in dom && !attr in attributes) {
      dom.removeAttribute(attr);
    } else {
      dom.setAttribute(attr, attributes[attr]);
    }
  });
}
