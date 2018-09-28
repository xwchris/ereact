// import { render, createElement, Component } from './src';
import { render, createElement, Component } from 'preact';
// import { render } from 'react-dom';
// import { Component, createElement } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: true
    }
  }

  componentWillMount() {
    console.log('app - will mount');
  }

  componentWillUpdate() {
    console.log('app - will update');
  }

  componentWillReceiveProps() {
    console.log('app - will receive');
  }

  componentDidMount() {
    console.log('app - did mount');
  }

  componentDidUpdate() {
    console.log('app - did update');
  }

  shouldComponentUpdate() {
    console.log('app - should render');
    return true;
  }

  componentWillUnmount() {
    console.log('app - unmount');
  }

  toggle() {
    this.setState({
      current: !this.state.current
    })
  }

  render() {
    console.log('app - render', this.state.current);
    return (
      <div className="component-app">
        {
          this.state.current ? <Home /> : <Person />
        }
        <button onClick={() => this.toggle()}>toggle</button>
      </div>
    )
  }
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1
    }
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentWillUpdate() {
    console.log('will update');
  }

  componentWillReceiveProps() {
    console.log('will receive');
  }

  componentDidMount() {
    console.log('did mount');
  }

  componentDidUpdate() {
    console.log('did update');
  }

  shouldComponentUpdate() {
    console.log('should render');
    return true;
  }

  componentWillUnmount() {
    console.log('unmount');
  }

  onAddCount() {
    console.log('set state');
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    console.log('render');
    return (
      <div className="component-home">
        <h1>{this.state.count}</h1>
        <button onClick={() => this.onAddCount()}>add</button>
      </div>
    )
  }
}

class Person extends Component {
  componentDidMount() {
    console.log('person did mount');
  }

  render() {
    return (
      <div className="component-person">
        { name }
      </div>
    )
  }
}

render(
  <div className="container">
    <App />
    <h2>hello world</h2>
  </div>,
  document.getElementById('root')
);
