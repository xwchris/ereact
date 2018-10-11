/**
 * Create an duplicate-free version of an array which only the first occurrence of each element is kept.
 *
 * @param {Array} array the array to inspect
 *
 * @return the new duplicate free array
 *
 */

const uniq = originArray => {
  const array = originArray.slice();
  return array.reverse()
  .filter((item, index) => array.lastIndexOf(item) === index)
  .reverse();
}


/**
 * Defers invoking function until the current call stack has cleared
 *
 * @param {Function} func the function will defer
 *
 */

const defer = func => {
  if (typeof Promise === 'function') {
    Promise.resolve().then(func);
  } else {
    setTimeout(func);
  }
}

const isArray = array => {
  return Array.isArray
  ? Array.isArray(array)
  : Object.prototype.toString.call(array) === '[object Array]';
}

export { uniq, defer, isArray };
