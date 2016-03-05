import path from 'path';
import webpack from 'webpack';

const config = {
  target: 'web',
  entry: [
    'webpack-hot-middleware/client',
    './src/client',
  ],
  output: {
    path: path.resolve(__dirname, 'build', 'public'),
    publicPath: '/',
    filename: 'client.js',
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
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
  },
};

export default config;
