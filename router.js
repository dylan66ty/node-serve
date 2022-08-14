const upload = require('./routes/upload')
const user = require('./routes/user')


/**
 * 
 * @param {import('koa-router')} router 
 */
const registerRoutes = (router) => {
  router.post('/upload', upload)
  user(router)
} 



module.exports = registerRoutes