import path from 'path';

import _ from 'lodash';
import update from 'react-addons-update';
import webpack from 'webpack';

const configs = {
  base: {
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
            'isomorphic-style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          ],
        },
      ],
    },
    plugins: [],
    resolve: {
      extensions: ['', '.js', '.json', '.jsx'],
    },
  },
  server: {
    target: { $set: 'node' },
    entry: {
      $set: [
        './src/server',
      ],
    },
    output: {
      $set: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, 'build'),
        filename: 'server.js',
      },
    },
    externals: {
      $set: /^(?!((\.*\/)|!)).*$/,
    },
    node: {
      $set: {
        __filename: true,
        __dirname: true,
      },
    },
  },
  serverDevelopment: {

  },
  serverProduction: {

  },
  client: {
    target: { $set: 'web' },
    entry: {
      $set: [
        './src/client',
      ],
    },
    output: {
      $set: {
        path: path.resolve(__dirname, 'build', 'public'),
        filename: 'client.js',
      },
    },
  },
  clientDevelopment: {
    entry: {
      $unshift: ['webpack-hot-middleware/client'],
    },
    output: {
      publicPath: { $set: '/' },
    },
    plugins: {
      $unshift: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
      ],
    },
  },
  clientProduction: {

  },
};

function config({ target = 'server', env = 'development' }) {
  return update(update(configs.base, configs[target]), configs[`${target}${_.capitalize(env)}`]);
}

module.exports = config;
