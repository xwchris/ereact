import render from './src/render';
import createElement from './src/createElement';
import { Component } from './src/component';
// import { render, createElement, Component } from 'preact';

class Container extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

class SubContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <h2>4</h2>
        <button onClick={this.onClick}>click me</button>
        <h1>{this.state.count}</h1>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById('root')
);
