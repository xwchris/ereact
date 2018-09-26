import { idiff } from '../src/diff';

describe('render test', () => {

  test('idiff test with dom null and vnode string', () => {
    expect(idiff(null, 'hello world')).toEqual(document.createTextNode('hello world'))
  })

  test('idiff test with dom null and vnode object', () => {
    expect(idiff(null, {
      type: 'div',
      attributes: {},
      children: []
    })).toEqual(document.createElement('div'))
  })

  test("idiff test with a dom and vnode which is different type", () => {
    expect(idiff(document.createElement('h1'), {
      type: 'div',
      attributes: {},
      children: []
    })).toEqual(document.createElement('div'))
  })
})
