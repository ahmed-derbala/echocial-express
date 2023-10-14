const { validationResult } = require('express-validator')
const { log } = require(`../log/log`)
/**
 * handle errors
 * @param {Object} error
 * @param {Object | String} error.err the error message or object
 * @param {Request} error.req request object
 * @param {Response} error.res response object
 * @param {Next} error.next next object
 */
exports.errorHandler = ({ err, req, res, next, caller }) => {
	//console.log(this.errorHandler[0]);
	//console.log('err',err)
	//console.log('errorHandler...')
	//console.error( err.code)

	let status = 500
	let errObject = {}
	errObject.level = 'error'
	//errObject.arguments=arguments

	if (err) {
		if (typeof err == 'object') {
			if (err.errors) {
				errObject.error = err.errors
				status = 422
				errObject.message = 'validation error'
				errObject.level = 'warn'
			}
			if (err.message) {
				errObject.message = err.message
			}
			if (err.stack) {
				errObject.message = err.toString()
				errObject.error = err.stack
			}
			if (err.name) {
				if (err.name == 'ValidationError' || err.code == 11000) {
					status = 409
				}
				if (err.name == 'TokenExpiredError') {
					status = 401
				}
			}
		}

		if (typeof err == 'string') {
			errObject.message = err
			errObject.error = err
		}
	}

	if (!errObject.message) errObject.message = 'error'

	if (req) {
		errObject.req = {}
		errObject.req.status = status
		errObject.req.method = req.method
		errObject.req.url = req.originalUrl
		errObject.req.ip = req.headers['x-forwarded-for']
		errObject.req.user = req.user
		errObject.req.body = req.body
	}
	log(errObject)
	if (res) {
		//console.log('error returned with res')
		return res.status(status).json(errObject)
	}
	//console.log('errObject no res')
	return errObject
}

/**
 * checking errors returned by validator, it should be called directly after validator on routes
 */
exports.validatorCheck = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return this.errorHandler({ err: errors, req, res })
	}
	return next()
}
