const path = require("path");
const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	webpack.chainWebpack(config => {
		// config.resolve.set('fallback', {
		// 	Buffer: require.resolve('buffer'),
		// 	crypto: require.resolve('crypto-browserify'),
		// 	util: require.resolve('util'),
		// 	stream: require.resolve('stream-browserify'),
		// 	'zlib': false,
		// 	'url': false,
		// 	'path': false,
		// 	'net': false,
		// 	'child_process': false,
		// 	'domain': false,
		// 	'fs': false,
		// 	'http': false,
		// 	'https': false,
		// });
	
		// config
		// .plugin('BufferPlugin') // arbitrary name
		// .use(require.resolve('webpack/lib/ProvidePlugin'), [
		// 	{ Buffer: ['buffer', 'Buffer'] },
		// ]);

		// config.plugin('NormalModuleReplacementPlugin')
		// .use(
		// 	require.resolve('webpack/lib/NormalModuleReplacementPlugin');,
		// 	[
		// 		/.*\/happy-dom\/lib\/fetch\/ResourceFetchHandler(\.js)?$/,
		// 		function(resource){
		// 			console.log(`!! resource`, resource);
		// 			console.log(`!! will replace resource.request with:`, path.resolve(__dirname, "lib", "ResourceFetchHandler.js"));

		// 			resource.request = path.resolve(__dirname, "lib", "ResourceFetchHandler.js");
		// 		}
		// 	]
		// );

		// Swap out their ResourceFetchHandler for ours (which uses
		// NativeScript's global fetch() rather than their Node-based one).
		// Responsible for this error (that seems to be inconsequential..?):
		// > Watchpack Error (initial scan): Error: ENOTDIR: not a directory, scandir '/Users/jamie/Documents/git/nativescript-dom/node_modules/happy-dom/lib/fetch/ResourceFetchHandler.js'
		config.resolve.alias
		.set(
			require.resolve("happy-dom/lib/fetch/ResourceFetchHandler"),
			path.resolve(__dirname, "lib", "ResourceFetchHandler.js"),
		);
	});

	return webpack.resolveConfig();
};


