import path from 'path';
import webpack from 'webpack';
import postCssCssNext from 'postcss-cssnext';

function config({ target = 'client', env = 'development' }) {
  const web = target === 'client';
  const dev = env === 'development';

  return {
    target: web ? 'web' : 'node',
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
          loaders: [
            `${web ? '' : 'fake-'}style${dev ? '?sourceMap' : ''}`,
            `css?modules&importLoaders=1&localIdentName=${dev ? '[path]___[name]__[local]___' : ''}[hash:base64:5]`,
            'postcss',
          ],
        },
      ],
    },
    postcss: () => [postCssCssNext],
    plugins: [
      ...(dev ? [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
      ] : []),
    ],
    externals: web ? null : /^(?!((\.*\/)|!)).*$/,
    node: web ? null : {
      __filename: true,
      __dirname: true,
    },
    resolve: {
      extensions: ['', '.js', '.json', '.jsx'],
    },
  };
}

module.exports = config;
