module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    ctx.status = status;
    // 获取客户端请求接受类型
    const acceptedType = ctx.accepts('html', 'text', 'json');
    let errorMsg = 'Internal Server Error';
    if (status === 404) {
      errorMsg = 'Not Found';
    }
    switch (acceptedType) {
      case 'json':
        ctx.type = 'application/json';
        ctx.body = { error: errorMsg };
        break;
      default:
        ctx.type = 'text/plain';
        ctx.body = errorMsg;
        break;
    }
  }
};
