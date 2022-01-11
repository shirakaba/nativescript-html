const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	webpack.chainWebpack(config => {
		config
		.resolve.merge({
			fallback: {
				"util": false,
				"bufferutil": false,
				"utf-8-validate": false,
				"stream": false,
				"tty": false,
				"path": false,
				"os": false,
				"zlib": false,
				"net": false,
				"crypto": false,
				"http": false,
				"https": false,
				"url": false,
				"assert": false,
				"string_decoder": false,
				"vm": false,
				"child_process": false,
				"canvas": false,
				"buffer": false,
			}
		})
	});

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
};


