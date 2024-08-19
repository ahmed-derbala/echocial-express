const express = require('express')
const router = express.Router()
const { check, query, param } = require('express-validator')
const { authenticate } = require(`../../core/auth`)
const ratingsSrvc = require('./ratings.service')
const { errorHandler } = require('../../core/utils/error')
const { patchRatingVld, createRatingVld } = require('./ratings.validator')
const { validate } = require('../../core/validation')
const { updateRatingCurrentValueSrvc, createOrUpdateRatingSrvc } = require('./ratings.service')
const { resp } = require('../../core/helpers/resp')
const { log } = require('../../core/log')
const { ratingNotFoundTrns } = require('./ratings.transalation')

router.post('/', authenticate(), validate(createRatingVld), async (req, res) => {
	try {
		const rating = await createOrUpdateRatingSrvc({
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

module.exports = router
