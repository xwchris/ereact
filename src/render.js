import diff from './diff';

const render = (vnode, container) => {
  diff(null, vnode, container);
}

export default render;
