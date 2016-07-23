import path from 'path';
import webpack from 'webpack';
import postCssCssNext from 'postcss-cssnext';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import webpackNodeExternals from 'webpack-node-externals';
import pkg from './package';

function config({ target = 'client', env = process.env.NODE_ENV }) {
  const web = target === 'client';
  const dev = env === 'development';

  function getBabelLoader(vue) {
    const config = Object.assign({}, pkg.babel, {
      babelrc: false,
      presets: web ? ([
        `es2015${dev ? '' : '-loose'}${vue ? '' : '-native-modules'}`,
        ...pkg.babel.presets.filter((preset) => preset !== 'es2015-auto'),
      ]) : pkg.babel.presets,
      plugins: pkg.babel.plugins,
    });
    return `babel?${JSON.stringify(config)}`;
  }

  const stylusLoader = ExtractTextWebpackPlugin.extract({
    notExtractLoader: web ? `style${dev ? '?sourceMap' : ''}` : 'fake-style',
    loader: `css?${dev ? 'sourceMap' : 'minimize'}!postcss!stylus`,
  });

  return {
    target: web ? 'web' : 'node',
    devtool: dev ? (web ? 'eval-source-map' : 'inline-source-map') : null,
    debug: dev,
    entry: {
      [target] : [
        ...(dev ? (web ? ['webpack-hot-middleware/client']
                       : ['source-map-support/register', 'webpack/hot/poll?1000'])
                : []),
        `./src/${target}`,
      ],
      [`${web ? '../' : ''}tests/${target}`]: `./src/${target}/tests`,
    },
    output: {
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'build', web ? 'public' : ''),
      publicPath: '/public/',
      chunkFilename: 'chunks/[id].js',
      filename: '[name].js',
      pathInfo: dev,
    },
    url: {
      dataUrlLimit: 1024,
    },
    module: {
      loaders: [
        {
          test: /\.(css|styl(us)?)$/i,
          exclude: /src\/components\/.*\.css$/i,
          loaders: stylusLoader,
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: getBabelLoader(false),
        },
        {
          test: /\.json$/i,
          loader: 'json',
        },
        {
          test: /\.vue$/,
          loader: 'vue',
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            `${web ? '' : 'fake-'}url?name=images/[hash].[ext]`,
            'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
          ],
        },
      ],
    },
    postcss: () => [postCssCssNext],
    vue: {
      loaders: {
        babel: getBabelLoader(true),
        stylus: stylusLoader,
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new ExtractTextWebpackPlugin({
        filename: 'client.css',
        allChunks: true,
        disable: dev || !web,
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      ...(dev ? [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin(),
        ] : [
          new webpack.optimize.DedupePlugin(),
          ...(web ? [
            new webpack.optimize.UglifyJsPlugin({
              output: {
                comments: false,
              },
              compress: {
                warnings: false,
              },
            })
          ] : []),
        ]
      ),
    ],
    externals: web ? null : [webpackNodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    })],
    node: web ? {
      fs: 'empty',
    } : {
      __filename: false,
      __dirname: false,
    },
    resolve: {
      extensions: ['', '.js', '.json', '.vue'],
    },
  };
}

module.exports = config;
