const path = require("path");
const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	webpack.chainWebpack(config => {
		/**
		 * If you wish to use window.Buffer, set this to `true` and run:
		 *   npm install --save buffer
		 */
		const supportBuffer = false;
		/**
		 * If you wish to use window.FileReader, set both this and supportBuffer
		 * to `true` and run:
		 *   npm install --save buffer stream-browserify util
		 */
		const supportFileReader = false;

		config.resolve.set('fallback', {
			...{
				buffer: supportBuffer ? require.resolve('buffer') : false,
			},
			...(
				(supportFileReader && supportBuffer) ?
					{
						stream: require.resolve('stream-browserify'),
						util: require.resolve('util'),
					} :
					{}
			),
		});

		if(!supportFileReader){
			config.resolve.alias
			.set(
				require.resolve("happy-dom/lib/file/FileReader"),
				"nativescript-dom/lib/FileReader.js",
			);
		}

		// TODO: find some more sustainable way to ensure that Window, Document,
		// HTMLElement and everything else is shimmed before custom elements are
		// registered and userland code is run.
		config
		.plugin('DOMShimPlugin') // arbitrary name
		.use(require.resolve('webpack/lib/ProvidePlugin'), [
			{ HTMLElement: ['happy-dom/lib/nodes/html-element/HTMLElement.js', 'default'] },
		]);

		config.entry('bundle').prepend("nativescript-dom");

		// Swap out their ResourceFetchHandler for ours (which uses
		// NativeScript's global fetch() rather than their Node-based one).
		// Responsible for this error (that seems to be inconsequential..?):
		// > Watchpack Error (initial scan): Error: ENOTDIR: not a directory, scandir '/Users/jamie/Documents/git/nativescript-dom/node_modules/happy-dom/lib/fetch/ResourceFetchHandler.js'
		config.resolve.alias
		.set(
			require.resolve("happy-dom/lib/fetch/ResourceFetchHandler"),
			"nativescript-dom/lib/ResourceFetchHandler.js",
		)
		.set(
			"node-fetch",
			"nativescript-dom/lib/NodeFetch.js",
		)
		.set(
			"perf_hooks",
			"nativescript-dom/lib/Performance.js",
		)
		.set(
			"vm",
			"nativescript-dom/lib/VM.js",
		);
	});

	return webpack.resolveConfig();
};

