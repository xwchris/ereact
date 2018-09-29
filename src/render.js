import diff from './diff';

/**
 * render VNode
 *
 * @param {VNode} vnode virtual node
 * @param {Element} container the container dom element
 *
 */

const render = (vnode, container) => {
  diff(null, vnode, container, {});
}

export default render;
