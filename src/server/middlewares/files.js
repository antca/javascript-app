import koaSend from 'koa-send';

function filesMiddleware(path) {
  return (ctx) => {
    return koaSend(ctx, ctx.path, { root: path });
  };
}

export default filesMiddleware;
