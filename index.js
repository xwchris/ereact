import { render, createElement, Component } from './src';
// import { render, createElement, Component } from 'preact';
// import { render } from 'react-dom';
// import { Component, createElement } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0
    }
  }

  getChildContext() {
    return {
      name: 'xwchris'
    };
  }

  componentDidMount() {
    console.log('context', this.context);
  }

  toggle() {
    this.setState({
      current: this.state.current + 1
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState, this.state)
  }

  render() {
    return (
      <div className="component-app">
        {/* <h1>{this.state.current}</h1>
        <button onClick={() => this.toggle()}>add</button> */}
        <Home />
      </div>
    )
  }
}

class Test extends Component {
  getChildContext() {
    return {
      test: 'xiaowei'
    }
  }

  render() {
    return (
      <h1 className="context">
        TEST {this.context.test}
      </h1>
    )
  }
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    }
  }

  render() {
    return (
      <div className="component-home">
        <h1>HOME: {this.context.name}</h1>
        <h1>HOME: {this.context.test}</h1>
      </div>
    )
  }
}

render(
  <div className="container">
    <App />
    <Test />
  </div>,
  document.getElementById('root')
);
