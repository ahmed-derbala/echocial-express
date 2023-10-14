const express = require('express')
const router = express.Router()
const { check, query, param } = require('express-validator')
const validatorCheck = require(`../../core/utils/error`).validatorCheck
const { authenticate } = require(`../../core/auth/auth`)
const reputationsSrvc = require('./reputations.service')

const { errorHandler } = require('../../core/utils/error')

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

router.post(
	'/',
	// authenticate(),
	[check('facebook').isObject(), check('facebook.id').notEmpty(), check('facebook.url').notEmpty(), check('rating').isObject(), check('rating.currentValue').notEmpty()],
	validatorCheck,
	async (req, res) => {
		try {
			const { facebook, rating } = req.body
			const reputation = await reputationsSrvc.createReputation({
				facebook,
				rating
			})
			return res.status(200).json({ data: reputation, status: 200 })
		} catch (err) {
			errorHandler({ err, res, req })
		}
	}
)

router.post(
	'/:reputationId',
	// authenticate(),
	[check('facebook').notEmpty(), check('facebook.id').notEmpty(), check('facebook.url').notEmpty(), param('reputationId').notEmpty()],
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

module.exports = router
