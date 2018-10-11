import EReact, { createElement, render, Component } from '../index';

describe('test export', () => {
  test('createElement, render and Component is not undefined', () => {
    expect(createElement).toBeDefined();
    expect(render).toBeDefined();
    expect(Component).toBeDefined();

    expect(EReact.createElement).toBeDefined();
    expect(EReact.render).toBeDefined();
    expect(EReact.Component).toBeDefined();
  })
})
