/**
 * this file has the logging system
 * logging system written in seperate file to make it easy to integrates in other projects and to be extensible as possible
 */
const config = require(`../../config`)
const logger = require('./logger')
const { removeEmptyKeys } = require('../helpers/removeEmptyKeys')

/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
let log = (module.exports.log = ({ level, label, error, message, req }) => {
	let logObject = {}
	level = level ? level : 'debug'
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) return null

	if (config.log.levels.isActive) logObject.level = level
	if (config.log.label.isActive) logObject.label = label ? label : null
	if (config.log.error.isActive) logObject.error = error ? error : null
	logObject.message = message ? message : null
	if (config.log.req.isActive) {
		if (message === reqDefaultLog) {
			logObject.req = req ? req : null //morgan format, see morgan.tokenString in config
		} else {
			logObject.req = req ? sanitizeReq(req) : null
		}
	}
	if (config.log.memory.isActive) logObject.memory = parseFloat((process.memoryUsage.rss() / config.log.memory.unit).toFixed(3))
	if (config.log.caller.isActive) {
		const stack = new Error().stack
		let caller = null
		if (stack) {
			caller = stack.split('\n')[2].trim()
		}
		logObject.caller = caller
	}
	logObject = removeEmptyKeys(logObject)

	logger[level](logObject)
})

let sanitizeReq = (module.exports.sanitizeReq = (req) => {
	let result = {
		status: req.status,
		method: req.method,
		originalUrl: req.originalUrl,
		user: req.user,
		body: req.body,
		ip: req.ip
	}
	if (!config.log.req.headers.isActive) return result

	let headers = {}
	if (config.log.req.headers.token.isActive) headers.token = req.headers.token
	if (config.log.req.headers.tid.isActive) headers.tid = req.headers.tid

	result.headers = headers
	result = removeEmptyKeys(result)
	return result
})

let reqDefaultLog = (module.exports.reqDefaultLog = 'morgan_log')
