import diff from './diff';
import { FORCE_RENDER, SYNC_RENDER } from './constants';

function Component (props) {
  this.props = props;
  this.state = this.state || {};

  this._renderCallbacks = [];
}

Object.assign(Component.prototype, {
  setState: function (state, callback) {
    if (!this.prevState) this.prevState = this.state;
    this.state = Object.assign({}, this.state, state);
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this);
  },
  forceUpdate: function(callback) {
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, FORCE_RENDER);
  },
  render: function() {}
})

const buildComponentFromVNode = (dom, vnode) => {
  const props = vnode.attributes;

  let inst;
  if (dom == null || dom._component == null || dom._component.constructor !== vnode.type) {
    inst = createComponent(vnode.type, props);

    const needUnmount = !!(dom && dom._component);
    if (needUnmount && dom._component.componentWillUnmount) {
      dom._component.componentWillUnmount();
    }
  } else {
    inst = dom._component;
  }

  setComponentProps(inst, props);
  return inst.base;
}

const createComponent = (Constructor, props) => {
  let inst;
  if (Constructor.prototype && Constructor.prototype.render) {
    inst = new Constructor(props);
    Component.call(inst, props);
  } else {
    inst = new Component(props);
    inst.render = () => Constructor(props);
  }

  inst.constructor = Constructor;
  return inst;
}

// componentWillMount
// componentWillReceiveProps
const setComponentProps = (component, props) => {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps){
    component.componentWillReceiveProps(props);
  }

  if (!component.prevProps) component.prevProps = component.props;
  component.props = props;

  renderComponent(component);
}

// shouldComponentUpdate
// componentWillUpdate
// render
// componentDidUpdate
const renderComponent = (component, renderMode = SYNC_RENDER) => {
  const props = component.props;
  const state = component.state;
  const prevProps = component.prevProps || props;
  const prevState = component.prevState || state;
  const isUpdate = !!component.base;
  const isForceRender = renderMode === FORCE_RENDER;
  let skipRender = false;

  if (isUpdate) {
    component.props = prevProps;
    component.state = prevState;
    if (!isForceRender && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state) === false) {
      skipRender = true;
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state);
    }
    component.props = props;
    component.state = state;
  }

  component.prevProps = component.prevState = null;

  if (!skipRender) {
    const rendered = component.render();
    const base = diff(component.base, rendered, null);
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
