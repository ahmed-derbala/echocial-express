const express = require('express')
const router = express.Router()
const { authenticate } = require(`../../core/auth`)
const { getidentitiesSrvc, updateRatingSrvc, getUseridentitiesrvc, createIdentitySrvc } = require('./identities.service')
const { errorHandler } = require('../../core/utils/error')
const { validate } = require('../../core/validation')
const { createIdentityVld, updateReputationVld, getidentitiesVld } = require('./identities.validator')
const { resp } = require('../../core/helpers/resp')

router.get('/', validate(getidentitiesVld), authenticate(), async (req, res) => {
	try {
		const result = await getidentitiesSrvc({ page: req.query.page, limit: req.query.limit, searchText: req.query.searchText })
		return resp({ status: 200, ...result, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

router.post('/create', validate(createIdentityVld), authenticate(), async (req, res) => {
	try {
		const { name, facebook, rating } = req.body
		const identity = await createIdentitySrvc({ name, facebook, rating, createdBy: req.user._id })
		return resp({ status: 200, data: identity, req, res })
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
		const result = await getUseridentitiesrvc({ userId: req.user._id })
		return res.status(result.status).json(result)
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
module.exports = router
