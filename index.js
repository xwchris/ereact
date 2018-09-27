import createElement from './src/createElement';
import render from './src/render';
import { Component } from './src/component';
// import { render, createElement, Component } from 'preact';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1
    }
  }

  onAddCount() {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div className="component-app">
        <h1>{this.state.count}</h1>
        <button onClick={() => this.onAddCount()}>click me</button>
      </div>
    )
  }
}

render(
  <div className="container">
    <App />
  </div>,
  document.getElementById('root')
);
