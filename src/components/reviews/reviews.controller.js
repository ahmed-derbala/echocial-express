const express = require('express')
const router = express.Router()
const { authenticate } = require(`../../core/auth`)
const { errorHandler } = require('../../core/utils/error')
const { patchRatingVld, createRatingVld } = require('./reviews.validator')
const { validate } = require('../../core/validation')
const { updateRatingCurrentValueSrvc, createOrUpdatereviewsrvc, findReviews } = require('./reviews.service')
const { resp } = require('../../core/helpers/resp')
const { log } = require('../../core/log')
const { ratingNotFoundTrns } = require('./reviews.transalation')

router.post('/create', authenticate(), validate(createRatingVld), async (req, res) => {
	try {
		const rating = await createOrUpdatereviewsrvc({
			userId: req.user._id,
			currentValue: req.body.currentValue,
			reputationId: req.body.reputationId
		})
		return resp({ status: 200, data: rating, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.patch('/', validate(patchRatingVld), authenticate(), async (req, res) => {
	try {
		const ratingIsUpdated = await updateRatingCurrentValueSrvc({
			userId: req.user._id,
			currentValue: req.body.currentValue,
			reputationId: req.body.reputationId
		})

		if (!ratingIsUpdated) {
			return resp({ status: 400, data: null, message: ratingNotFoundTrns({ lang: req.user.settings?.lang }), req, res })
		}
		// return resp({ status: 400, json: {data:null,message:ratingIsUpdated}, req, res })
	} catch (err) {
		//reject(errorHandler({ err, req, res }))
		errorHandler({ err, req, res })
	}
	//})
})

router.post('/find', authenticate(), async (req, res) => {
	try {
		const { page, limit } = req.query
		const { match, select } = req.body
		const reviews = await findReviews({ match, select, page, limit })
		return resp({ status: 200, data: reviews, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
module.exports = router
