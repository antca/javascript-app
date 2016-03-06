import koaConvert from 'koa-convert';
import koaCompose from 'koa-compose';
import getWebpackConfig from '../../../webpack.config.babel';
import Webpack from 'webpack';
import koaWebpackHotMiddleware from 'koa-webpack-hot-middleware';
import koaWebpackDevMiddleware from 'koa-webpack-dev-middleware';

function devMiddleware() {
  const webpackConfig = getWebpackConfig({ target: 'client', env: 'development' });

  const compiler = new Webpack(webpackConfig);

  const devMiddleware = koaConvert(koaWebpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));

  const hotMiddleware = koaConvert(koaWebpackHotMiddleware(compiler));

  return koaCompose([devMiddleware, hotMiddleware]);
}

export default devMiddleware;
