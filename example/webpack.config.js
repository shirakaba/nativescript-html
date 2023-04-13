const path = require('path');
const webpack = require('@nativescript/webpack');

require('util').inspect.defaultOptions.depth = null;

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.chainWebpack((config, env) => {
    supportReact(config, env);

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

    /**
     * If you wish to use window.ReadableStream, window.WritableStream, and
     * window.TransformStream, set this to `true` and run:
     *   npm install --save buffer stream-browserify
     */
    const supportStream = false;

    config.resolve.set('fallback', {
      ...{
        buffer: supportBuffer ? require.resolve('buffer') : false,
      },
      ...{
        util:
          supportFileReader && supportBuffer ? require.resolve('util') : false,
      },
      ...{
        stream:
          supportStream || (supportFileReader && supportBuffer)
            ? require.resolve('stream-browserify')
            : false,
      },
    });

    if (!supportFileReader) {
      config.resolve.alias.set(
        require.resolve('happy-dom/lib/file/FileReader'),
        'nativescript-html/lib/FileReader.js'
      );
    }

    config.entry('bundle').prepend('nativescript-html');

    // Swap out their ResourceFetchHandler for ours (which uses
    // NativeScript's global fetch() rather than their Node-based one).
    // Responsible for this error (that seems to be inconsequential..?):
    // > Watchpack Error (initial scan): Error: ENOTDIR: not a directory, scandir '/Users/jamie/Documents/git/nativescript-html/node_modules/happy-dom/lib/fetch/ResourceFetchHandler.js'
    config.resolve.alias
      .set(
        require.resolve('happy-dom/lib/xml-http-request/XMLHttpRequest'),
        'nativescript-html/lib/XMLHttpRequest.js'
      )
      .set(
        require.resolve('happy-dom/lib/fetch/Fetch'),
        'nativescript-html/lib/fetch/Fetch.js'
      )
      .set(
        require.resolve('happy-dom/lib/fetch/Request'),
        'nativescript-html/lib/fetch/Request.js'
      )
      .set(
        require.resolve('happy-dom/lib/fetch/Response'),
        'nativescript-html/lib/fetch/Response.js'
      )
      .set(
        require.resolve('happy-dom/lib/fetch/Headers'),
        'nativescript-html/lib/fetch/Headers.js'
      )
      .set(
        require.resolve('happy-dom/lib/location/Location'),
        'nativescript-html/lib/Location.js'
      )
      .set(
        require.resolve('happy-dom/lib/event/Event'),
        'nativescript-html/dist/Event.js'
      )
      .set(
        require.resolve('happy-dom/lib/event/EventTarget'),
        'nativescript-html/dist/EventTarget.js'
      )
      .set('node-fetch', 'nativescript-html/lib/NodeFetch.js')
      .set('perf_hooks', 'nativescript-html/lib/Performance.js')
      .set('vm', 'nativescript-html/lib/VM.js');
  });

  const resolved = webpack.resolveConfig();

  // Make nativescript-hot-loader test .tsx files (not sure how to chain).
  resolved.module.rules[2].test = /\.(js|ts)x?$/;

  return resolved;
};

/**
 * @param {import('webpack-chain')} config
 * @param {import('@nativescript/webpack').IWebpackEnv} env
 */
function supportReact(config, env) {
  const production = !!env.production;

  const platform = webpack.Utils.platform.getPlatformName();
  config.resolve.extensions.prepend('.tsx').prepend(`.${platform}.tsx`);

  config.module
    .rule('ts')
    .test([...config.module.rule('ts').get('test'), /\.tsx$/]);

  config.module
    .rule('ts')
    .test([...config.module.rule('ts').get('test'), /\.tsx$/]);

  // todo: use env
  let isAnySourceMapEnabled = true;

  // todo: env flag to forceEnable?
  config.when(env.hmr && !production, (config) => {
    config.module
      .rule('ts')
      .use('babel-loader|react-refresh')
      .loader('babel-loader')
      .before('ts-loader')
      .options({
        sourceMaps: isAnySourceMapEnabled ? 'inline' : false,
        babelrc: false,
        plugins: ['react-refresh/babel'],
      });

    config
      .plugin('ReactRefreshPlugin')
      .use(require('@pmmmwh/react-refresh-webpack-plugin'), [
        {
          /**
           * Maybe one day we'll implement an Error Overlay, but the work involved is too daunting for now.
           * @see https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/79#issuecomment-644324557
           */
          overlay: false,
        },
      ]);
  });
}
