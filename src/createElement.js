import { TEXT_ELEMENT } from './constants';

/**
 * vnode constructor
 */
function VNode () {}

/**
 * Create VNode element
 *
 * @param { string | function } type
 * @param { object } attributes
 * @param { Array(VNode) } children
 *
 * @return { VNode } vnode
 */

const createElement = (type, attributes, ...args) => {

  // shallow copy attribute
  const clonedAttributes = Object.assign({}, attributes);

  // flatten children and filter children
  const rawChildren = [].concat(...args);
  const children = rawChildren
    .filter(child => child != null && typeof child !== 'boolean')
    .map(child => child instanceof Object ? child : createTextElement(child));

  // create and assign vnode
  const vnode = new VNode();

  clonedAttributes.children = children;

  vnode.type = type;
  vnode.attributes = clonedAttributes;
  vnode.children = children;

  return vnode;
}

const createTextElement = text => ({ type: TEXT_ELEMENT, attributes: { nodeValue: text }, children: [] });

export default createElement;
