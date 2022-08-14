const os = require('os')
const net = require('net')


const generatePort = (defaultPort = 3000) => {
  return new Promise((resolve) => {
    let traverse = (port) => {
      const serve =  net.createServer().listen(port)
      serve.on('listening', () => {
        serve.close()
        resolve(defaultPort)
      })
      serve.on('error', (err) => {
        if(err.code === 'EADDRINUSE') {
          traverse(++defaultPort)
          serve.close()  
        }
      })
    }
    traverse(defaultPort)
  })

}

const getIPv4 = () => {
  const networkInterfaces = os.networkInterfaces()
  const keys = Object.keys(networkInterfaces)
  const targetKey = keys[0]
  const ips = networkInterfaces[targetKey]
  const target = ips.find(f => f.family === 'IPv4')
  let address = '0.0.0.0'
  if(target) {
    address = target.address
  }
  return address
}



module.exports = {
  getIPv4,
  generatePort
}

