const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const registerRoutes = require('./router')
const listener = require('./listener')
const cors = require('./middlewares/cors')

const app = new Koa()
const router = new Router()

app.use(static('public'))
app.use(cors)


registerRoutes(router)


app.use(router.allowedMethods())
app.use(router.routes())


listener(app)




