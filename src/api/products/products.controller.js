const express = require('express')
const router = express.Router()
const { check, query, param } = require('express-validator')
const validatorCheck = require(`../../core/utils/error`).validatorCheck
const { authenticate } = require(`../../core/auth`)

const { errorHandler } = require('../../core/utils/error')
const productsSrvc = require('./products.service')

router.get(
	'/',
	authenticate(),
	/* [
    //  check('user').exists(),
    check('user.email').isEmail(),
    check('user.password').isString().notEmpty(),
    //   check('user.phones').isArray(),
    //  check('user.phones.*.countryCode').isString().notEmpty(),
    //  check('user.phones.*.shortNumber').isString().notEmpty()

  ],
  validatorCheck,*/
	async (req, res) => {
		try {
			const { page, limit } = req.query

			return productsSrvc.findAll({ page, limit }).then((result) => {
				return res.status(200).json(result)
			})
			//.catch(err => errorHandler({ err, res }))
		} catch (err) {
			return errorHandler({ err })
		}
	}
)

router.post('/', [check('name').isString()], validatorCheck, async (req, res) => {
	const { name } = req.body
	return productsSrvc
		.create({ name, req })
		.then((data) => {
			return res.status(200).json({ data })
		})
		.catch((err) => errorHandler({ err, req, res }))
})

router.post('/signout', authenticate(), async (req, res) => {
	return Sessions.deleteOne({ token: req.headers.token })
		.then((deletedSession) => {
			return res.status(200).json({ msg: 'singedout', data: deletedSession })
		})
		.catch((err) => errorHandler({ err, res }))
})

module.exports = router
