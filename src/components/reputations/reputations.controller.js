const express = require('express')
const router = express.Router()
const { authenticate } = require(`../../core/auth`)
const { getReputationsSrvc, updateRatingSrvc, getUserReputationSrvc, createReputationSrvc } = require('./reputations.service')
const { errorHandler } = require('../../core/utils/error')
const { validate } = require('../../core/validation')
const { createReputationVld, updateReputationVld, getReputationsVld } = require('./reputations.validator')
const { resp } = require('../../core/helpers/resp')

router.get('/', validate(getReputationsVld), authenticate(), async (req, res) => {
	try {
		const result = await getReputationsSrvc({ page: req.query.page, limit: req.query.limit, searchText: req.query.searchText })
		return resp({ status: 200, ...result, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

router.post('/', validate(createReputationVld), authenticate(), async (req, res) => {
	try {
		const { facebook, rating } = req.body
		const ctrlResp = await createReputationSrvc({
			facebook,
			rating,
			byUserId: req.user._id
		})
		return resp({ status: 200, json: ctrlResp, req, res })
	} catch (err) {
		errorHandler({ err, res, req })
	}
})

router.put('/', validate(updateReputationVld), authenticate(), async (req, res) => {
	const { facebook } = req.body
	return updateRatingSrvc({ facebook })
		.then((data) => {
			return res.status(200).json(data)
		})
		.catch((err) => errorHandler({ err, req, res }))
})

router.get('/me', authenticate(), async (req, res) => {
	try {
		const result = await getUserReputationSrvc({ userId: req.user._id })
		return res.status(result.status).json(result)
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
module.exports = router
