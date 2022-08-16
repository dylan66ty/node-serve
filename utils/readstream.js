const Events = require('events')
const fs = require('fs')

class ReadStream extends Events {
  constructor(path,opts = {}){
      super()
      this.path = path
      this.flags = opts.flags || 'r'
      this.mode = opts.mode || 0o6666
      this.autoClose = opts.autoClose
      this.start = opts.start || 0
      this.end = opts.end 
      this.highWaterMark = opts.highWaterMark || 64
      // 记录读取的偏移量
      this.pos =  this.start
      // 默认创建体格可读流 是非流模式 不会触发data事件
      this.flowing = false 

      this.on('newListener', (type) => {
        if(type === 'data') {
          this.flowing = true
          this.read()
        }
        
      })
      this.open()
  }
  open () {
    fs.open(this.path,this.flags,this.mode, (err,fd) => {
      if(err) {
        return this.emit('error', err)
      }
      this.fd = fd
      this.emit('open',fd)
    })
  }
  read(){
   if(typeof this.fd !== 'number') {
    return this.once('open', () => this.read())
   }
   const buffer = Buffer.alloc(this.highWaterMark)
   console.log(this.pos);
   let howMuchToRead = this.end ? Math.min(this.end - this.pos + 1, this.highWaterMark) : this.highWaterMark 
   fs.read(this.fd,buffer,0,howMuchToRead,this.pos, (err,bytesRead) => {
    if(err) return this.emit('error',err)
    if(bytesRead) {
      this.pos += bytesRead
      this.emit('data', buffer.slice(0,bytesRead))
      if(this.flowing) {
        this.read()
      }
    }else {
      this.emit('end')
      if(this.autoClose) {
        fs.close(this.fd,() => {
          this.emit('close')
        })
      }
    }

   })
  }
  pause(){
    this.flowing = false
  }
  resume(){
    this.flowing = true
    this.read()
  }
}

module.exports = ReadStream

// 