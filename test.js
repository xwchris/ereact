import render from './src/render';
import createElement from './src/createElement';
import { Component } from './src/component';

class Container extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.children;
  }
}

class SubContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.children;
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
      <Container>
        <Container>
          <button onClick={this.onClick}>click me</button>
          <h1>hello world{this.state.count}</h1>
        </Container>
      </Container>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
);
