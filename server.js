const net = require('net'),
    { Log } = require('./util')
    
const server = net.createServer()

server.listen(3000, () => {
    console.log('服务器端口：3000');
})

server.on('connection', (socket) => {
    socket.on("data", (data) => {
        Log(`获取数据：${data}`)
        socket.write('你好啊')
    })
})
