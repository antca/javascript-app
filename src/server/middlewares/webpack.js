import koaConvert from 'koa-convert';
import webpackConfig from '../../../webpack.config.client.babel';
import Webpack from 'webpack';
import koaWebpackHotMiddleware from 'koa-webpack-hot-middleware';
import koaWebpackDevMiddleware from 'koa-webpack-dev-middleware';

const compiler = new Webpack(webpackConfig);

const devMiddleware = koaConvert(koaWebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

const hotMiddleware = koaConvert(koaWebpackHotMiddleware(compiler));

export { devMiddleware, hotMiddleware };
