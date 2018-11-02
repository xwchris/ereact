import { diff } from './diff';

/**
 * render VNode
 *
 * @param {VNode} vnode virtual node
 * @param {Element} container the container dom element
 *
 */

const render = (element, container) => {
  return diff(null, element, container, {});
}

export default render;
