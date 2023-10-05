/**
 * this file has the logging system
 * logging system written in seperate file to make it easy to integrates in other projects and to be extensible as possible
 */
const config = require(`../../config/config`)
const logger = require('./logger')
/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
module.exports.log = ({ level, label, error, message, req }) => {
	if (!config.log.isActive || !config.log.level.allowed.includes(level))
		return null
	let logObject = {}
	if (config.log.level.isActive) logObject.level = level ? level : 'debug'
	if (config.log.label.isActive) logObject.label = label ? label : null
	if (config.log.error.isActive) logObject.error = error ? error : null
	logObject.message = message ? message : null
	if (config.log.req.isActive) logObject.req = req ? req : null
	if (config.log.memory.isActive)
		logObject.memory = parseFloat(
			(process.memoryUsage.rss() / config.log.memory.unit).toFixed(3)
		)

	logger[level](logObject)
}
