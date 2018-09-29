// import { render, createElement, Component } from './src';
import { render, createElement, Component } from 'preact';
// import { render } from 'react-dom';
// import { Component, createElement } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0
    }
  }

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

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState, this.state)
  }

  render() {
    return (
      <div className="component-app">
        <h1>{this.state.current}</h1>
        <button onClick={() => this.toggle()}>add</button>
      </div>
    )
  }
}

// class Home extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       count: 0
//     }
//   }

//   onClick() {
//     console.log(this.props.value);
//     this.props.parentClick();
//     console.log(this.props.value);
//     this.props.parentClick();
//   }

//   render() {
//     return (
//       <div className="component-home">
//         <h1>HOME {this.state.count}</h1>
//         <button onClick={() => this.onClick()}>click</button>
//       </div>
//     )
//   }
// }

render(
  <div className="container">
    <App />

    <h2>hello world</h2>
  </div>,
  document.getElementById('root')
);
