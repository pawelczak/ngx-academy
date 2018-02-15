const path = require('path'),
	ROOT = path.resolve(__dirname, '..');

exports.root = path.join.bind(path, ROOT);
