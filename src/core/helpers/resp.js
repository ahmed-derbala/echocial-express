const { errorHandler } = require('../../core/utils/error')

/**
 *
 * @param {*} param0
 * @returns
 */
exports.resp = ({ req, status, data, view, res, redirect }) => {
	if (!res) return errorHandler({ req, res, err: 'res is required' })

	if (view) {
		return res.render(view, { ...data })
	}
	if (redirect) {
		return res.redirect(redirect)
	}
	return res.status(status).json({ data: { ...data.toJSON() }, req: { headers: { tid: req.headers.tid } } })
}
