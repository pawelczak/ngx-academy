var path = require('path');

var ROOT = path.resolve(__dirname, '..');

exports.root = path.join.bind(path, ROOT);
