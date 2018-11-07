export const isArray = array => typeof Array.isArray === 'function' ? Array.isArray(array) : Object.prototype.toString.call(array) === '[object Array]';

export const defer = func => typeof Promise === 'function' ? Promise.resolve().then(func) : setTimeout(func);

export const flatten = array => array.reduce((flat, toFlatten) => flat.concat(isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
