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
module.exports.log = ({ level, error, message, req }) => {
	if (!config.log.allowedLevels.includes(level)) return null
	if (!message) message = 'no_message'
	if (!level) level = 'debug'

	let memory = null
	if (config.log.memory)
		memory = parseFloat((process.memoryUsage.rss() / 1000000000).toFixed(3)) // in GB

	logger[level]({ level, error: error ? error : false, message, req, memory })
}
