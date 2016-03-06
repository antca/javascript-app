import koaConvert from 'koa-convert';
import getWebpackConfig from '../../../webpack.config.babel';
import Webpack from 'webpack';
import koaWebpackHotMiddleware from 'koa-webpack-hot-middleware';
import koaWebpackDevMiddleware from 'koa-webpack-dev-middleware';

const webpackConfig = getWebpackConfig({ target: 'client', env: 'development' });

const compiler = new Webpack(webpackConfig);

const devMiddleware = koaConvert(koaWebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

const hotMiddleware = koaConvert(koaWebpackHotMiddleware(compiler));

export { devMiddleware, hotMiddleware };
