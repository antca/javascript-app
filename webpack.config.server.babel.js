import path from 'path';

const config = {
  target: 'node',
  entry: './src/server',
  output: {
    libraryTarget: 'commonjs',
    path: 'build',
    filename: 'server.js',
  },
  externals: /^(?!((\.*\/)|!)).*$/,
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        loader: 'babel',
      },
      {
        test: /\.css$/,
        loaders: [
          'isomorphic-style?sourceMap',
          'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
  },
};

export default config;
