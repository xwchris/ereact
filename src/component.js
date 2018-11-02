import { idiff, diffChildren } from './diff';
import { FORCE_RENDER, SYNC_RENDER, ASYNC_RENDER, INTERNAL_NODE } from './constants';
import { defer, isArray } from './utils';

const willRenderQueue = [];

/**
 * Component Class which need to be inherited by component
 *
 * @param {Object} props the props to be initialized
 * @param {Object} context the context to be initialized
 *
 */

function Component (props, context) {

  // preact is true, here not understand
  this._dirty = false;

  this.props = props;
  this.state = this.state || {};
  this.context = context || {};

  this._renderCallbacks = [];
}

Object.assign(Component.prototype, {
  /**
   * Change component state
   *
   * @param {Object} state the state will be set
   * @param {Function} callback callback after the component rendered
   *
   */

  setState: function (state, callback) {
    if (!this.prevState) this.prevState = this.state;
    this.state = Object.assign({}, this.state, state);
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, ASYNC_RENDER, this.context, this[INTERNAL_NODE], this[INTERNAL_NODE].parentDom);
  },


  /**
   * Update component force which means ignore shouldComponentUpdate hook value
   *
   * @param {Function} callback callback after the component rendered
   */

  forceUpdate: function(callback) {
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, FORCE_RENDER, this.context, this[INTERNAL_NODE], this[INTERNAL_NODE].parentDom);
  },


  /**
   * Default render function
   */

  render: function() {}
})

const buildComponent = (oldNode, element, parentDom, context) => {
  const props = element.attributes;

  let component;
  if (oldNode == null || oldNode.component == null || oldNode.element == null || oldNode.element.type !== element.type) {
    component = createComponent(element.type, props, context);
    oldNode.component = component;
    // TODO: add unmount lifecycle
    // const needUnmount = !!(dom && dom._component);
    // if (needUnmount && dom._component.componentWillUnmount) {
    //   dom._component.componentWillUnmount();
    // }
  } else {
    component = oldNode.component;
  }

  setComponentProps(component, props, context);
  renderComponent(component, SYNC_RENDER, context, oldNode, parentDom);
  return component[INTERNAL_NODE];
}

/**
 * create component instance
 *
 * @param {Function} Constructor component constructor which is class or function
 * @param {Object} props the props to be initialized
 * @param {Object} context the context to be initialized
 *
 * @return component instance
 */

const createComponent = (Constructor, props, context) => {
  let inst;
  if (Constructor.prototype && Constructor.prototype.render) {
    inst = new Constructor(props, context);
    Component.call(inst, props, context);
  } else {
    inst = new Component(props, context);
    inst.render = () => Constructor(props, context);
  }

  inst.constructor = Constructor;
  return inst;
}

/**
 * Set component props
 *
 * @param {Component} component component which will attach props
 * @param {Object} props the props to be attached
 * @param {Object} context via context
 *
 */

const setComponentProps = (component, props) => {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps){
    component.componentWillReceiveProps(props);
  }

  if (!component.prevProps) component.prevProps = component.props;
  if (!component.prevContext) component.prevContext = component.context;
  component.props = props;
}

/**
 * Render component to dom element
 *
 * @param {Component} component component instance to render
 * @param {string} renderMode render mode
 * @param {Object} context context to be transported to children
 *
 */

const renderComponent = (component, renderMode, context, oldNode, parentDom) => {
  const props = component.props;
  const state = component.state;
  const prevProps = component.prevProps || props;
  const prevState = component.prevState || state;
  const prevContext = component.prevContext || context;
  const isUpdate = !!(oldNode && oldNode.dom);
  const isForceRender = renderMode === FORCE_RENDER;
  let skipRender = false;

  // async render
  if (renderMode === ASYNC_RENDER) {
    if (!component._dirty && willRenderQueue.push({ component, oldNode, parentDom }) === 1) {
      component._dirty = true;

      defer(() => {
        const { component: willRenderedComponent, oldNode: nextOldNode, parentDom: nextParentDom } = willRenderQueue.pop();
        if (willRenderedComponent._dirty) renderComponent(willRenderedComponent, SYNC_RENDER, context, nextOldNode, nextParentDom);
      })
    }
    return;
  }

  component._dirty = false;

  if (isUpdate) {
    component.props = prevProps;
    component.state = prevState;
    component.context = prevContext;
    if (!isForceRender && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state) === false) {
      skipRender = true;
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state);
    }
    component.props = props;
    component.state = state;
    component.context = context;
  }

  component.prevProps = component.prevState = component.prevContext = null;

  if (!skipRender) {
    if (component.getChildContext) {
      context = Object.assign({}, context, component.getChildContext());
    }

    // rendered maybe an array
    const renderedElement = component.render();
    if (isArray(renderedElement)) {
      const childNodes = diffChildren((component[INTERNAL_NODE] || {}).childNodes, renderedElement, parentDom, context);

      component[INTERNAL_NODE] = {
        dom: null,
        element: renderedElement,
        component: (component[INTERNAL_NODE] || {}).component || null,
        childNodes: childNodes,
        parentDom: parentDom
      }
    } else {
      component[INTERNAL_NODE] = component[INTERNAL_NODE] || {};
      const node = idiff(component[INTERNAL_NODE], renderedElement, parentDom, context);

      component[INTERNAL_NODE] = {
        dom: node.dom,
        element: renderedElement,
        component: (component[INTERNAL_NODE] || {}).component || null,
        childNodes: node.childNodes || [],
        parentDom: parentDom
      }
    }

    if (!isUpdate && component.componentDidMount) {
      component.componentDidMount();
    } else if (isUpdate && component.componentDidUpdate) {
      component.componentDidUpdate(prevProps, prevState);
    }
  }

  while (component._renderCallbacks.length) component._renderCallbacks.pop().call(component);
}

export { buildComponent, Component };
