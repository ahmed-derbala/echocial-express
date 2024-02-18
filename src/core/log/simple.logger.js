const clc = require('cli-color')

const simplelogger = ({ level, label, error, message, req }) => {
	let logObject = { level, label, error, message, req }
	switch (level) {
		case 'error':
			console.error(clc.white.bold.bgRed(level, label, error, JSON.stringify(message), JSON.stringify(req)))
			break

		case 'warn':
			console.warn(clc.yellow(level, label, error, JSON.stringify(message), JSON.stringify(req)))
			break

		case 'verbose':
			console.info(clc.green(level, label, error, JSON.stringify(message), JSON.stringify(req)))
			break

		case 'socket':
			console.log(clc.blue(level, label, error, JSON.stringify(message), JSON.stringify(req)))
			break

		case 'debug':
			console.log(clc.white(level, label, error, JSON.stringify(message), JSON.stringify(req)))
			break

		default:
			console.log(clc.blue(level, label, error, JSON.stringify(message), JSON.stringify(req)))
	}
}

module.exports = { simplelogger }
/*
error: 0,
    warn: 1,
        verbose: 2,
            socket: 3,
                debug: 4,
                    success: 5,
                        startup: 6*/
