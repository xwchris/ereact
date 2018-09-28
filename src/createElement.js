
/**
 * vnode constructor
 */
function VNode () {}

/**
 * create vnode
 *
 * @param { string | function } type
 * @param { object } attributes
 * @param { Array(VNode) } children
 *
 * @return { VNode } vnode
 */

const createElement = (type, attributes, ...children) => {

  // shallow copy attribute
  const clonedAttributes = Object.assign({}, attributes);

  // flatten children and filter children
  const filteredChildren = [].concat(...children);

  // create and assign vnode
  const vnode = new VNode();

  clonedAttributes.children = filteredChildren;

  vnode.type = type;
  vnode.attributes = clonedAttributes;
  vnode.children = filteredChildren;

  return vnode;
}

export default createElement;
