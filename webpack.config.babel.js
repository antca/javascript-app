import path from 'path';
import webpack from 'webpack';
import postCssCssNext from 'postcss-cssnext';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import webpackNodeExternals from 'webpack-node-externals';
import StaticSiteGeneratorWebpackPlugin from 'static-site-generator-webpack-plugin';
import pkg from './package';

function config({ target = 'client', env = process.env.NODE_ENV }) {
  const web = target === 'client';
  const dev = env === 'development';

  return {
    target: web ? 'web' : 'node',
    devtool: dev ? (web ? 'eval-source-map' : 'inline-source-map') : null,
    debug: dev,
    entry: {
      [target] : [
        ...(dev ? (web ? ['webpack-hot-middleware/client', 'react-hot-loader/patch']
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
          test: /\.json$/i,
          loader: 'json',
        },
        {
          test: /\.jsx?$/i,
          exclude: /node_modules/,
          loader: 'babel',
          query: Object.assign({}, pkg.babel, {
            babelrc: false,
            presets: web ? ([
              ...pkg.babel.presets.filter((preset) => preset !== 'es2015-auto'),
              ...(dev ? ['es2015'] : ['es2015-webpack', 'es2015-webpack-loose']),
            ]) : pkg.babel.presets,
            plugins: [...pkg.babel.plugins, ...(dev ? ['react-hot-loader/babel'] : [])],
          }),
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            `${web ? '' : 'fake-'}url?name=images/[hash].[ext]`,
            'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
          ],
        },
        {
          test: /\.(woff2?|[ot]tf|eot)$/i,
          loaders: [
            `${web ? '' : 'fake-'}url?name=fonts/[hash].[ext]`,
          ],
        },
        {
          test: /\.css$/i,
          exclude: /src\/components\/.*\.css$/i,
          loaders: ExtractTextWebpackPlugin.extract(
            web ? `style${dev ? '?sourceMap' : ''}` : 'fake-style',
            `css?${dev ? 'sourceMap' : 'minimize'}!postcss`,
          ),
        },
        {
          test: /src\/components\/.*\.css$/i,
          loaders: ExtractTextWebpackPlugin.extract(
            web ? `style${dev ? '?sourceMap' : ''}` : 'fake-style',
            `css?${dev ? 'sourceMap&' : 'minimize&'}modules&importLoaders=1&localIdentName=${dev ? '[path]___[name]__[local]___' : ''}[hash:base64:5]!postcss`,
          ),
        },
      ],
    },
    postcss: () => [postCssCssNext],
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new ExtractTextWebpackPlugin('client.css', {
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
          ] : [
            new StaticSiteGeneratorWebpackPlugin('server', ['index.html']),
          ]),
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
      extensions: ['', '.js', '.json', '.jsx'],
    },
  };
}

module.exports = config;
