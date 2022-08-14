const uuid = require('uuid')
const path = require('path')
const mime = require('mime')
const fs = require('fs')

const dataAccept = (ctx) => {
  return new Promise((resolve) => {
    const bufs = []
    ctx.req.on('data', chunk => {
      bufs.push(chunk)
    })
  
    ctx.req.on('end',  () => {
      const buffer = Buffer.concat(bufs)
      const contentType = ctx.get('Content-Type')
      if(!contentType.includes('boundary')) {
        resolve({fail: true ,message: 'request Content-Type error'})
        return
      }
      const boundary = contentType.split('boundary')[1].slice(1)  
      const lines = buffer.split(boundary).slice(1,-1)
      const result = {}
      lines.forEach(line => {
        const items = line.split('\r\n\r\n')
        const headBuf = Buffer.concat(items.slice(0,1))
        const bodyBuf = Buffer.concat(items.slice(1))
        const headStr = headBuf.toString()
        const key = headStr.match(/name="(.+?)"/)[1] 

        if(headStr.includes('filename')) {
          const contentType = headStr.match(/Content-Type:\s(.+)/)[1]
          const type = mime.getExtension(contentType) || 'txt'
          // 这里就是文件二进制，需要写入
          // 截取buffer后缀 --\r\n\r\n
          const fileBuf = bodyBuf.slice(0,-4)
          const filepath = path.join(__dirname,'../public/upload',`${uuid.v4()}.${type}`)
          result[key] = {
            filepath:filepath.replace(/\\/g,'/').split('public')[1],
            size: fileBuf.length
          }
          
          const isDirExist = fs.existsSync(path.join(__dirname,'../public/upload'))
          if(!isDirExist) {
            fs.mkdirSync(path.join(__dirname,'../public/upload'))
          }

          fs.writeFileSync(filepath,fileBuf)
  
        }else {
          result[key] = bodyBuf.slice(0,-4).toString()
        }
  
      })
      resolve(result)
    })
  

  })
}

/**
 *
 * @param {import('koa').Context} ctx
 */
const upload = async (ctx) => {
  const result =  await dataAccept(ctx)
  if(result.fail) {
    ctx.status = 400
    ctx.body = result
    return
  }
  ctx.status = 200
  ctx.body = result
}

Buffer.prototype.split = function (sep) {
  const sepLenth = Buffer.from(sep).length
  const result = []
  let offset = 0
  let currentIndex = 0

  while((currentIndex = this.indexOf(sep,offset)) !== -1) {
    result.push(this.slice(offset,currentIndex))
    offset = currentIndex + sepLenth
  }
  result.push(this.slice(offset))
  return result
}


module.exports = upload
