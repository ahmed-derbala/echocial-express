const { errorHandler } = require('../../core/utils/error')

/**
 *
 * @param {*} param0
 * @returns
 */
exports.resp = ({ status, message, req, data, pagination, res }) => {
	if (!res) return errorHandler({ req, res, err: 'res is required' })
	return res.status(status).json({ status, message, pagination, data, req: { headers: { tid: req.headers.tid } } })
}
