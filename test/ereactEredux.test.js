import { Provider } from 'ereact-eredux';
import createElement from '../src/createElement';
import render from '../src/render';

const App = () => (<div></div>)
const element = <App store={{}}><div></div></App>
describe('element should be created', () => {
  test('element should be rendered', () => {
    render(element, document.createElement('div'));
  })
})
