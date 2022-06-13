const webpack = require("@nativescript/webpack");
const ProvidePlugin = require.resolve('webpack/lib/ProvidePlugin');

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	webpack.chainWebpack(config => {
		config.resolve.set('fallback', {
			Buffer: require.resolve('buffer'),
			crypto: require.resolve('crypto-browserify'),
			util: require.resolve('util'),
			stream: require.resolve('stream-browserify'),
		});
	
		config
		.plugin('BufferPlugin') // arbitrary name
		.use(ProvidePlugin, [
			{ Buffer: ['buffer', 'Buffer'] },
		]);
	});

	return webpack.resolveConfig();
};


