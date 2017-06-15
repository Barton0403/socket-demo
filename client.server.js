const http = require('http'),
	url = require('url'),
	fs = require('fs'),
    {
        Log,
        decodeDataFrame,
        encodeDataFrame,
        generateSecWebSocketAccept
    } = require('./util')

const clientHtml = fs.readFileSync('./client.html')

const server = http.createServer((req, res) => {
	const URL = url.parse(req.url)
	if (URL.pathname === '/') {
		res.writeHead(200)
		res.end(clientHtml)
		return
	}

	if (URL.pathname === 'socket') {

	}
})

server.on('connection', (socket) => {

})

server.on('upgrade', (req, socket) => {
	const URL = url.parse(req.url)
    if (URL.pathname === '/socket') {
    	// socket.setKeepAlive(true, 1000 * 60)
        socket.setTimeout(0) // 防止自动断开
    	socket.on('data', (data) => {
            data = decodeDataFrame(data)
            // console.log(data);

            if (data.Opcode === 8) {
                Log('客户端断开TCP连接')
                return
            }

            Log('获取数据：' + data.PayloadData)
            socket.write(encodeDataFrame({
                FIN: 1,
                Opcode: 1,
                PayloadData: '你好啊'
            }))
    	})

    	let key = req.headers['sec-websocket-key']
    	key = generateSecWebSocketAccept(key)

    	socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
    		'Upgrade: WebSocket\r\n' +
    		'Connection: Upgrade\r\n' +
    		'Sec-WebSocket-Accept: ' + key + '\r\n' +
    		'\r\n')

        socket.on('timeout', (s) => {
            console.log('服务器断开TCP连接');
            socket.destroy()
        })

    	Log('握手成功');
    }

	// socket.pipe(socket)
})

server.listen(8080, 'localhost', () => {
	console.log('HTTP服务器监听端口：8080')
})
