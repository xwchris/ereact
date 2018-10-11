import diff from './diff';

/**
 * render VNode
 *
 * @param {VNode} vnode virtual node
 * @param {Element} container the container dom element
 *
 */

const render = (vnode, container) => {
  return diff(null, vnode, container, {});
}

export default render;
