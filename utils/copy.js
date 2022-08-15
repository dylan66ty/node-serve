const fs = require('fs')
const path = require('path')

// fs.copyFile('./a.txt', './b.txt', () => {
//   console.log('a');
// })

// fd => file descript 文件描述 window系统从3开始 0,1,2被占用了
const copy = (srcPath,destPath,cb) => {
  const size = 3
  const buffer = Buffer.alloc(size)
  let readOffset = 0
  let writeOffset = 0
    fs.open(srcPath, 'r',(err,rfd) => {
      if(err) return cb(err)
      fs.open(destPath,'w', (err,wfd) => {
        if(err) return cb(err)
        const next = () => {
          fs.read(rfd,buffer,0,size,readOffset,(err,bytesRead) => {
            fs.write(wfd,buffer,0,bytesRead,writeOffset,(err,written) => {
              readOffset += size
              writeOffset += size
              if(bytesRead === 3) {
                next()
              }else {
                fs.close(rfd)
                fs.close(wfd)
                cb()
              }
            })
          })
        }
        next()
      })

    })
}

copy(path.join(__dirname,'a.txt'),path.join(__dirname,'b.txt'), () => {
  console.log('complete');
})