import path from 'path';
import webpack from 'webpack';
import postCssCssNext from 'postcss-cssnext';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';

function config({ target = 'client', env = 'development' }) {
  const web = target === 'client';
  const dev = env === 'development';

  return {
    target: web ? 'web' : 'node',
    devtool: dev ? 'eval-source-map' : null,
    entry: [
      ...(web && dev ? ['webpack-hot-middleware/client'] : []),
      `./src/${web ? 'client' : 'server'}`
    ],
    output: {
      libraryTarget: web ? void 0 : 'commonjs',
      path: path.resolve(__dirname, 'build', web ? 'public' : ''),
      publicPath: web && dev ? '/' : null,
      filename: `${web ? 'client' : 'server'}.js`,
    },
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel',
        },
        {
          test: /\.css$/,
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
      new ExtractTextWebpackPlugin('client.css', {
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
    externals: web ? null : /^(?!((\.*\/)|!)).*$/,
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
