const { log } = require('../log/log');
const  conf  = require(`../../configs/config`)

exports.socketio = ({ server }) => {
    let socket = require('socket.io')(server, conf.socketio.options);

    socket.on('connection', (socketData) => {
        log({level:conf.log.levelNames.socket,message:`socketId=${socketData.id} | ip=${socketData.handshake.address} | userAgent=${socketData.handshake.headers['user-agent']}`})
    });

    socket.on('error', (error) => {
        console.log(error)
    })

    socket.on('disconnect', (reason) => {
        console.log(reason)


    })


}