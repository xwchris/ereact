/**
 * remove the same element in array
 *
 * @param { Array } array the array to be dealed
 */

export function uniq(array) {
  return array.reverse()
    .filter((item, index) => array.lastIndexOf(item) === index)
    .reverse();
}

export const defer = typeof Promise === 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
