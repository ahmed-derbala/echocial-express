const winston = require('winston') //logging module
const conf = require(`../../configs/config`)

winston.addColors(conf.log.colors)
module.exports = winston.createLogger(conf.log.createLoggerOptions)
