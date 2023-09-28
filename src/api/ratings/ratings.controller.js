const express = require("express")
const router = express.Router()
const { check, query, param } = require("express-validator")
const validatorCheck = require(`../../core/utils/error`).validatorCheck
const { authenticate } = require(`../../core/auth/auth`)
const ratingsSrvc = require("./ratings.service")
const { errorHandler } = require("../../core/utils/error")

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

router.post(
	"/",
	// authenticate(),
	[
		check("currentValue").notEmpty().isNumeric(),
		check("reputationId").notEmpty()
	],
	validatorCheck,
	async (req, res) => {
		const { currentValue } = req.body
		const { reputationId } = req.params
		const userId = "req.user._id"
		return ratingsSrvc
			.setRating({ currentValue, userId, reputationId })
			.then((data) => {
				return res.status(200).json(data)
			})
			.catch((err) => errorHandler({ err, req, res }))
	}
)

module.exports = router
