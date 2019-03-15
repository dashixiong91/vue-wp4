module.exports = async (ctx, next) => {
  const start = new Date();
  try {
    await next();
  } catch (error) {
    throw error;
  } finally {
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms `);
  }
};
