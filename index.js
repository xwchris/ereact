'use strict';

let EReact = null;

if (process.env.NODE_ENV === 'production') {
  EReact = require('./dist/ereact.production');
} else {
  EReact = require('./dist/ereact.development');
}

module.exports = EReact.default || EReact;
