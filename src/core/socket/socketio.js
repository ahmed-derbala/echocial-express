const { log } = require('../log/')
const config = require(`../../config`)

exports.socketio = ({ server }) => {
	let socket = require('socket.io')(server, config.socketio.options)

	socket.on('connection', (socketData) => {
		log({
			level: config.log.levelNames.socket,
			message: `socketId=${socketData.id} | ip=${socketData.handshake.address} | userAgent=${socketData.handshake.headers['user-agent']}`
		})
	})

	socket.on('error', (error) => {
		console.log(error)
	})

	socket.on('disconnect', (reason) => {
		console.log(reason)
	})
}
