import diff from './diff';
import { FORCE_RENDER, SYNC_RENDER, ASYNC_RENDER } from './constants';
import { defer } from './utils';

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
    renderComponent(this, ASYNC_RENDER);
  },


  /**
   * Update component force which means ignore shouldComponentUpdate hook value
   *
   * @param {Function} callback callback after the component rendered
   */

  forceUpdate: function(callback) {
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, FORCE_RENDER);
  },


  /**
   * Default render function
   */

  render: function() {}
})

/**
 * build component from VNode
 *
 * @param {Element} dom the dom to be contrasted
 * @param {VNode} vnode virtual node which will be used to create component
 * @param {Object} context component context
 *
 * @return component's root dom
 */

const buildComponentFromVNode = (dom, vnode, context) => {
  const props = vnode.attributes;

  let inst;
  if (dom == null || dom._component == null || dom._component.constructor !== vnode.type) {
    inst = createComponent(vnode.type, props, context);

    const needUnmount = !!(dom && dom._component);
    if (needUnmount && dom._component.componentWillUnmount) {
      dom._component.componentWillUnmount();
    }
  } else {
    inst = dom._component;
  }

  setComponentProps(inst, props, context);
  return inst.base;
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

const setComponentProps = (component, props, context) => {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps){
    component.componentWillReceiveProps(props);
  }

  if (!component.prevProps) component.prevProps = component.props;
  if (!component.prevContext) component.prevContext = component.context;
  component.props = props;

  renderComponent(component, SYNC_RENDER, context);
}

/**
 * Render component to dom element
 *
 * @param {Component} component component instance to render
 * @param {string} renderMode render mode
 * @param {Object} context context to be transported to children
 *
 */

const renderComponent = (component, renderMode = SYNC_RENDER, context) => {
  const props = component.props;
  const state = component.state;
  const prevProps = component.prevProps || props;
  const prevState = component.prevState || state;
  const prevContext = component.prevContext || context;
  const isUpdate = !!component.base;
  const isForceRender = renderMode === FORCE_RENDER;
  let skipRender = false;

  // async render
  if (renderMode === ASYNC_RENDER) {
    if (!component._dirty) {
      component._dirty = true;

      // maybe not correct
      willRenderQueue.push(component);
      defer(() => {
        const willRenderedComponent = willRenderQueue.pop();
        if (willRenderedComponent._dirty) renderComponent(willRenderedComponent, SYNC_RENDER, context);
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
    const rendered = component.render();
    if (component.getChildContext) {
      context = Object.assign({}, context, component.getChildContext());
    }
    const base = diff(component.base, rendered, null, context);
    component.base = base;

    if (!isUpdate && component.componentDidMount) {
      component.componentDidMount();
    } else if (isUpdate && component.componentDidUpdate) {
      component.componentDidUpdate(prevProps, prevState);
    }

    base._component = component;
  }

  while (component._renderCallbacks.length) component._renderCallbacks.pop().call(component);
}

export { buildComponentFromVNode, Component };
