const { log } = require('../log')
const { errorHandler } = require('../../core/utils/error')
exports.resp = ({ req, status, json, res }) => {
	if (!res) return errorHandler({ req, res, err: 'res is required' })
	return res.status(status).json({ ...json, tid: req.headers.tid })
}
