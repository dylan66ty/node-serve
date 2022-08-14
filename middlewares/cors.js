/**
 * 
 * @param {import('koa').Context} ctx 
 * @param {import('koa').Next} next 
 */
const cors = async (ctx,next) => {
  const origin = ctx.get('origin')
  ctx.set('Access-Control-Allow-Credentials', true)
  ctx.set('Access-Control-Allow-Origin' , origin)
  ctx.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  ctx.set("Access-Control-Allow-Headers", "x-requested-with,Authorization,Content-Type,Accept")
  ctx.set('Access-Control-Max-Age', '0')
  
  if(ctx.req.method === 'OPTIONS') {
    ctx.status = 204
    ctx.body = ''
  }else {
  await next()
  }
}

module.exports = cors 