import createElement from './src/createElement';
import render from './src/render';

render(
  <div class="container">
    <h1 style={{ color: 'red', backgroundColor: 'blue', padding: 10 }} onClick={() => console.log('hello world')}>hello world</h1>
  </div>,
  document.getElementById('root')
);
