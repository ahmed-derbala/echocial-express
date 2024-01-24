const winston = require('winston')
const config = require(`../../config`)

winston.addColors(config.log.levels.colors)
module.exports = winston.createLogger(config.log.createLoggerOptions)
