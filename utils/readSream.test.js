const fs = require('fs')
const path = require('path')
const ReadStream = require('./readstream')

const rs = new ReadStream(path.resolve(__dirname,'a.txt'), {
    flags: 'r',
    encoding: null, 
    mode: 0o666,
    autoClose: true,
    start: 0, // [0,8]
    end: 8,
    highWaterMark: 4
})

const bufs = []
rs.on('data',data => {
  console.log(data);
  bufs.push(data)
})

rs.on('end', () => {
  const buffer = Buffer.concat(bufs)
  console.log('end');
  // console.log(buffer.toString());
})
rs.on('error', (err) => {
  console.log(err);
})

// 文件流有两个特殊的事件
rs.on('open',() => {
  console.log('open');
})
rs.on('close', () => {
  console.log('close');
})
