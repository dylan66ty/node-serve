const {getIPv4 , generatePort} = require('./ipv4')
/**
 * @param {import('koa')} app
 */
const listener = async (app) => {
  const port = await generatePort()
  app.listen(port,() => {
    console.log(`serve run http://${getIPv4()}:${port}`);
  })
}


module.exports = listener