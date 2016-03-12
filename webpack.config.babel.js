import path from 'path';
import webpack from 'webpack';
import postCssCssNext from 'postcss-cssnext';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import webpackNodeExternals from 'webpack-node-externals';

function config({ target = 'client', env = 'development' }) {
  const web = target === 'client';
  const dev = env === 'development';

  return {
    target: web ? 'web' : 'node',
    devtool: dev ? (web ? 'eval-source-map' : 'inline-source-map') : null,
    debug: dev,
    entry: {
      [web ? 'public/client' : 'server'] : [
        ...(dev ? (web ? ['webpack-hot-middleware/client'] : ['source-map-support/register', 'webpack/hot/poll?1000']) : []),
        `./src/${web ? 'client' : 'server'}`,
      ],
      [`tests/${web ? 'client' : 'server'}`]: `./src/tests/${web ? 'client' : 'server'}`,
    },
    output: {
      libraryTarget: web ? void 0 : 'commonjs',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: '[name].js',
      pathInfo: dev,
    },
    module: {
      loaders: [
        {
          test: /\.json$/i,
          loader: 'json',
        },
        {
          test: /\.jsx?$/i,
          exclude: /node_modules/,
          loader: 'babel',
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            `${web ? '' : 'fake-'}url?limit=1000&name=public/images/[hash].[ext]`,
            'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
          ],
        },
        {
          test: /\.css$/i,
          loaders: ExtractTextWebpackPlugin.extract(
            web ? `style${dev ? '?sourceMap' : ''}` : 'fake-style',
            `css?${dev ? '' : 'minimize&'}modules&importLoaders=1&localIdentName=${dev ? '[path]___[name]__[local]___' : ''}[hash:base64:5]!postcss`
          ),
        },
      ],
    },
    postcss: () => [postCssCssNext],
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(dev),
      }),
      new ExtractTextWebpackPlugin('public/client.css', {
        allChunks: true,
        disable: dev || !web,
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      ...(dev ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          output: {
            comments: false,
          },
          compress: {
            warnings: false,
          },
        }),
      ]),
      ...(dev ? [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
      ] : []),
    ],
    externals: web ? null : [webpackNodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    })],
    node: web ? null : {
      __filename: false,
      __dirname: false,
    },
    resolve: {
      extensions: ['', '.js', '.json', '.jsx'],
    },
  };
}

module.exports = config;
