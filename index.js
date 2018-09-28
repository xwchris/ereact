import { render, createElement, Component } from './src';
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
        <div className="box">
          <h1>{this.state.count}</h1>
          <button onClick={() => this.onAddCount()}>click me</button>
        </div>
        <div>yes i am</div>
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
