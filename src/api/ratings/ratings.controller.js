const express = require('express')
const router = express.Router()
const { check, query, param } = require('express-validator')
const validatorCheck = require(`../../core/utils/error`).validatorCheck
const { authenticate } = require(`../../core/auth`)
const ratingsSrvc = require('./ratings.service')
const { errorHandler } = require('../../core/utils/error')

/*
router.get('/',
  // authenticate(),
  async (req, res) => {
    return reputationsSrvc.getReputations()
      .then(data => {
        return res.status(200).json(data)
      })
      .catch(err => errorHandler({ err, req, res }))
  })*/
/*
router.post('/',
  // authenticate(),
  [
    check('facebook').notEmpty(),
    check('facebook.id').notEmpty(),
    check('facebook.url').notEmpty()
  ],
  validatorCheck,
  async (req, res) => {
    const { facebook } = req.body
    return reputationsSrvc.createReputaion({ facebook })
      .then(data => {
        return res.status(200).json(data)
      })
      .catch(err => errorHandler({ err, req, res }))
  })*/

router.post('/', authenticate(), [check('currentValue').notEmpty().isNumeric(), check('reputationId').notEmpty()], validatorCheck, async (req, res) => {
	try {
		return ratingsSrvc
			.setRating({
				userId: req.user._id,
				currentValue: req.body.currentValue,
				reputationId: req.body.reputationId
			})
			.then((data) => {
				return res.status(200).json({ status: 200, data })
			})
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

module.exports = router
