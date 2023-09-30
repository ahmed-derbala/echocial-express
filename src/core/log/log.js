/**
 * this file has the logging system
 * logging system written in seperate file to make it easy to integrates in other projects and to be extensible as possible
 */
const conf = require(`../../configs/config`)
const logger = require('./logger')
/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
module.exports.log = ({ level, error, message, req }) => {
	if (!conf.log.allowedLevels.includes(level)) return null
	if (!message) message = 'no_message'
	if (!level) level = 'debug'

	let memory = null
	if (conf.log.memory) memory = Math.ceil(process.memoryUsage.rss() / 1000000) // in MB

	logger[level]({ level, error: error ? error : false, message, req, memory })
}
