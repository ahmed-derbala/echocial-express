const winston = require('winston')
const config = require(`../../config/config`)

winston.addColors(config.log.colors)
module.exports = winston.createLogger(config.log.createLoggerOptions)
