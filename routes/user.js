/**
 * 
 * @param {import('koa-router')} router 
 */
const user = (router) => {
    router.get('/list', queryList)
    router.post('/json', jsonRequest)
    router.post('/form', formRequest)
}

/**
 * 
 * @param {import('koa').Context} ctx 
 */
const queryList = (ctx) => {
  ctx.body = [ctx.query]
}

/**
 * 
 * @param {import('koa').Context} ctx 
 */
const jsonRequest = (ctx) => {
  ctx.body = {name: 'json'}
}

/**
 * 
 * @param {import('koa').Content} ctx 
 */
const formRequest = (ctx) => {
  ctx.body = {name: 'application/x-www-form-urlencoded'}
}

module.exports = user