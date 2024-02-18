const { validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error')

exports.validate = (validator) => {
	return async (req, res, next) => {
		await Promise.all(validator.map((schema) => schema.run(req)))
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return errorHandler({ err: errors, req, res })
		}
		return next()
	}
}
