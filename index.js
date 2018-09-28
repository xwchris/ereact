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

  componentDidMount() {
    // this.button.addEventListener('click', () => this.toggle());
  }

   componentWillUpdate(nextProps, nextState) {
    console.log('will update', this.state, nextState);
  }

   componentDidUpdate(prevProps, prevState) {
    console.log('did update', this.state, prevState);
  }

  // componentWillMount() {
  //   console.log('app - will mount');
  // }

  // componentWillUpdate() {
  //   console.log('app - will update');
  // }

  // componentWillReceiveProps() {
  //   console.log('app - will receive');
  // }

  // componentDidMount() {
  //   console.log('app - did mount');
  // }

  // componentDidUpdate() {
  //   console.log('app - did update');
  // }

  // componentWillUnmount() {
  //   console.log('app - unmount');
  // }

  toggle() {
    this.setState({
      current: this.state.current + 1
    });
    this.setState({
      current: this.state.current + 1
    });
    this.setState({
      current: this.state.current + 1
    });
    this.setState({
      current: this.state.current + 1
    });
  }

  render() {
    return (
      <div className="component-app">
        <h1>{this.state.current}</h1>
        <button ref="">toggle</button>
      </div>
    )
  }
}

class Home extends Component {
  // componentWillUpdate(nextProps, nextState) {
  //   console.log('will update', nextProps, nextState);
  // }

  componentWillReceiveProps(nextProps) {
    console.log('will receive', this.props, nextProps);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('did update', prevProps, prevState);
  // }

  render() {
    return (
      <div className="component-home">
        <h1>HOME {this.props.count}</h1>
        {this.props.children}
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
