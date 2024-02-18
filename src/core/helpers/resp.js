const { errorHandler } = require('../../core/utils/error')

/**
 *
 * @param {*} param0
 * @returns
 */
exports.resp = ({ req, status, json, res }) => {
	if (!res) return errorHandler({ req, res, err: 'res is required' })
	if (!json.data) json = { data: json }
	return res.status(status).json({ ...json, req: { headers: { tid: req.headers.tid } } })
}
