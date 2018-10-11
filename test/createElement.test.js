import createElement from '../src/createElement';

describe('createElement should return an vnode', () => {

  test('params attributes and children is empty', () => {
    expect(createElement('div')).toEqual({
      type: 'div',
      attributes: {children: []},
      children: []
    })
  })

  test('params children is array and attributes is null', () => {
    expect(createElement('div', null, [ null, 'hello', undefined, false, true ])).toEqual({
      type: 'div',
      attributes: {children: [null, 'hello', undefined, false, true]},
      children: [null, 'hello', undefined, false, true]
    })
  })

  test('params type is function', () => {
    const Home = function() {};
    expect(createElement(Home, { className: 'hello' }, 1, 2)).toEqual({
      type: Home,
      attributes: { className: 'hello', children: [1, 2] },
      children: [1, 2]
    })
  })
})
