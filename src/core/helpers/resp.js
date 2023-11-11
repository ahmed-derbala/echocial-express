const { log } = require('../log')

exports.resp = ({ req, status, json, res }) => {
	if (!res) return log({ level: 'error', message: 'res is required', caller: this.resp.name })
	return res.status(status).json({ ...json, tid: req.headers.tid })
}
