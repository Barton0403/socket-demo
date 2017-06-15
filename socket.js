const net = require('net'),
    { Log } = require('./util')

const client = new net.Socket()

client.connect(3000, 'localhost', () => {
    client.write('你好')
})

client.on('data', (data) => {
    Log(`获取数据：${data}`)
})
