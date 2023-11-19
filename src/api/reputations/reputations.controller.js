const express = require('express')
const router = express.Router()
const { body, query, param } = require('express-validator')
const { authenticate } = require(`../../core/auth`)
const reputationsSrvc = require('./reputations.service')
const { errorHandler, objectIdValidator, validatorCheck } = require('../../core/utils/error')

router.get(
	'/',
	authenticate(),
	[query('page').isNumeric().notEmpty().optional(), query('limit').isNumeric().notEmpty().optional(), query('searchText').trim().isString().optional()],
	validatorCheck,
	async (req, res) => {
		try {
			const result = await reputationsSrvc.getReputations({ page: req.query.page, limit: req.query.limit, searchText: req.query.searchText })
			return res.status(result.status).json(result)
		} catch (err) {
			errorHandler({ err, req, res })
		}
	}
)

router.get('/me', authenticate(), async (req, res) => {
	try {
		const result = await reputationsSrvc.getUserReputation({ userId: req.user._id })
		return res.status(result.status).json(result)
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.post(
	'/',
	authenticate(),
	[body('facebook').isObject(), body('facebook.id').notEmpty(), body('facebook.url').notEmpty(), body('rating').isObject(), body('rating.currentValue').notEmpty()],
	validatorCheck,
	async (req, res) => {
		try {
			const { facebook, rating } = req.body
			const reputation = await reputationsSrvc.createReputation({
				facebook,
				rating,
				byUserId: req.user._id
			})
			return res.status(200).json({ data: reputation, status: 200 })
		} catch (err) {
			errorHandler({ err, res, req })
		}
	}
)

router.post(
	'/',
	authenticate(),
	[body('facebook').notEmpty(), body('facebook.id').notEmpty(), body('facebook.url').notEmpty(), query('reputationId').custom(objectIdValidator)],
	validatorCheck,
	async (req, res) => {
		const { facebook } = req.body
		return reputationsSrvc
			.updateRating({ facebook })
			.then((data) => {
				return res.status(200).json(data)
			})
			.catch((err) => errorHandler({ err, req, res }))
	}
)

router.get('/blocking', async (req, res) => {
	//setTimeout(()=>res.send('done'),10000)
	const now = new Date().getTime()
	while (new Date().getTime() < now + 10000) {}
	res.send('done')
})

module.exports = router
