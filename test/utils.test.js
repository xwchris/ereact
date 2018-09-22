import * as utils from '../src/utils';

describe('test the utils function', () => {

  test('test the uniq', () => {
      const uniq = utils.uniq;
      expect(uniq([1, 2, 4, 2, 6, 6])).toEqual([1, 2, 4, 6])
  })
})
