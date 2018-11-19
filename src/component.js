import { INTERNAL_NODE, FORCE_RENDER, ASYNC_RENDER, SYNC_RENDER } from './constants';
import { reconcile, createNode } from './render';
import { isArray, defer } from './utils';

const willRenderQueue = [];

function Component (props, context) {
  this._dirty = false;

  this.props = props || {};
  this.context = context || {};

  this._renderCallbacks = []
}

Object.assign(Component.prototype, {
  setState(state, callback) {
    if (!this.prevState) {
      this.prevState = this.state;
    }
    this.state = Object.assign({}, this.state, state);
    if (typeof callback === 'function') {
      this._renderCallbacks.push(callback);
    }

    const oldNode = this[INTERNAL_NODE];
    const { dom, element } = oldNode;
    const parentDom = isArray(dom) ? dom[0].parentNode : dom.parentNode;

    updateComponent(ASYNC_RENDER, parentDom, oldNode, element, this.context);
  },

  forceUpdate(callback) {
    if (typeof callback === 'function') {
      this._renderCallbacks.push(callback);
    }

    const oldNode = this[INTERNAL_NODE];
    const { dom, element } = oldNode;
    const parentDom = isArray(dom) ? dom[0].parentNode : dom.parentNode;
    updateComponent(FORCE_RENDER, parentDom, oldNode, element, this.context);
  },

  render() {}
});

const buildComponent = (element, context) => {
  const { type, props } = element;
  let instance = null;

  instance = createComponent(type, props, context);
  setComponentProps(instance, props);

  instance[INTERNAL_NODE] = instance[INTERNAL_NODE] || { element };
  renderComponent(instance, context)

  return instance[INTERNAL_NODE];
}

const updateComponent = (renderMode, parentDom, oldNode, element, context, isReceiveProps) => {
  const instance = oldNode.instance;
  if (isReceiveProps) {
    setComponentProps(instance, element.props);
  }

  const props = instance.props;
  const state = instance.state;
  const prevProps = instance.prevProps || props;
  const prevState = instance.prevState || state;
  const prevContext = instance.prevContext || context;
  let skipRender = false;

  if (renderMode === ASYNC_RENDER) {
    if (!instance._dirty && willRenderQueue.push({ instance, parentDom, oldNode, element, context }) === 1) {
      // only first time
      instance._dirty = true;

      defer(() => {
        const {
          instance: nextInstance,
          parentDom: nextParentDom,
          oldNode: nextOldNode,
          element: nextElement,
          context: nextContext,
        } = willRenderQueue.pop();

        if (nextInstance._dirty) {
          instance._dirty = false;
          updateComponent(SYNC_RENDER, nextParentDom, nextOldNode, nextElement, nextContext);
        }
      });
    }
    return;
  }

  instance.props = prevProps;
  instance.state = prevState;
  instance.context = prevContext;

  if (renderMode !== FORCE_RENDER && typeof instance.shouldComponentUpdate === 'function' && instance.shouldComponentUpdate(props, state) === false) {
    skipRender = true;
  } else if (typeof instance.componentWillUpdate === 'function') {
    instance.componentWillUpdate(props, state);
  }

  instance.props = props;
  instance.state = state;
  instance.context = context;

  instance.prevProps = instance.prevState = instance.prevContext = null;

  if (!skipRender) {

    if (typeof instance.getChildContext === 'function') {
      context = Object.assign({}, context, instance.getChildContext());
    }

    const childElement = instance.render();
    const oldChildNode = oldNode.childNode;

    const childNode = reconcile(parentDom, oldChildNode, childElement, context);

    const dom = isArray(childNode) ? childNode.map(n => n.dom) : childNode.dom;

    Object.assign(oldNode, { dom, childNode, element });

    if (typeof instance.componentDidUpdate === 'function') {
      defer(() => instance.componentDidUpdate(prevProps, prevState));
    }

    while (instance._renderCallbacks.length) {
      instance._renderCallbacks.pop().call(instance);
    }
  }

  return oldNode;
}

const createComponent = (Constructor, props, context) => {
  let instance;
  if (!(Constructor.prototype && Constructor.prototype.render)) {
    const render = () => Constructor(props);
    instance = new Component(props, context);
    instance.render = render;
  } else {
    instance = new Constructor(props, context);
    Component.call(instance, props, context);
  }

  instance.constructor = Constructor;
  return instance;
}

const setComponentProps = (instance, props) => {
  const isUpdate = !!instance[INTERNAL_NODE];
  if (isUpdate && typeof instance.componentWillReceiveProps === 'function') {
    instance.componentWillReceiveProps(props);
  } else if (!isUpdate && typeof instance.componentWillMount === 'function'){
    instance.componentWillMount();
  }

  if (!instance.prevProps) instance.prevProps = instance.props;
  if (!instance.prevContext) instance.prevContext = instance.context;

  instance.props = props;
}

const renderComponent = (instance, context) => {
  instance.prevProps = instance.prevState = instance.prevContext = null;

  if (typeof instance.getChildContext === 'function') {
    context = Object.assign({}, context, instance.getChildContext());
  }

  const childElement = instance.render();

  let childNode = null;
  let dom = null;
  if (isArray(childElement)) {
    childNode = childElement.map(element => createNode(element, context))
    dom = childNode.map(n => n.dom);
  } else {
    childNode = createNode(childElement, context);
    dom = childNode.dom;
  }
  Object.assign(instance[INTERNAL_NODE], { dom, childNode, instance });

  if (typeof instance.componentDidMount === 'function') {
    defer(() => (instance.componentDidMount()));
  }

  while (instance._renderCallbacks.length) {
    instance._renderCallbacks.pop().call(instance);
  }
}

export { Component, buildComponent, updateComponent };
