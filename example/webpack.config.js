const path = require("path");
const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	webpack.chainWebpack(config => {
		// Swap out their ResourceFetchHandler for ours (which uses
		// NativeScript's global fetch() rather than their Node-based one).
		// Responsible for this error (that seems to be inconsequential..?):
		// > Watchpack Error (initial scan): Error: ENOTDIR: not a directory, scandir '/Users/jamie/Documents/git/nativescript-dom/node_modules/happy-dom/lib/fetch/ResourceFetchHandler.js'
		config.resolve.alias
		.set(
			require.resolve("happy-dom/lib/fetch/ResourceFetchHandler"),
			path.resolve(__dirname, "lib", "ResourceFetchHandler.js"),
		)
		.set(
			"node-fetch",
			path.resolve(__dirname, "lib", "NodeFetch.js"),
		);
	});

	return webpack.resolveConfig();
};


