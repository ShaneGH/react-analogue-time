'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/react-analogue-time.min.js');
} else {
    module.exports = require('./dist/react-analogue-time.js');
}
