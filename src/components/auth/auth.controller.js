const express = require('express')
const router = express.Router()
const { check, query, param } = require('express-validator')
const { authenticate } = require(`../../core/auth`)
const authSrvc = require('./auth.service')
const { errorHandler } = require('../../core/utils/error')
const { resp } = require('../../core/helpers/resp')

router.post(
	'/signup',
	[
		//  check('user').exists(),
		check('email').isEmail(),
		check('password').isString().notEmpty()
		//   check('user.phones').isArray(),
		//  check('user.phones.*.countryCode').isString().notEmpty(),
		//  check('user.phones.*.shortNumber').isString().notEmpty()
	],

	async (req, res) => {
		const { email, password } = req.body

		return authSrvc
			.signup({ email, password })
			.then((data) => {
				return res.status(200).json({ data })
			})
			.catch((err) => errorHandler({ err, res }))
	}
)

router.post('/signin', [check('loginId').trim().isString().notEmpty(), check('password').trim().isString().notEmpty()], async (req, res) => {
	try {
		const { loginId, password } = req.body
		const signinResp = await authSrvc.signin({ loginId, password, req })
		return resp({ status: 200, data: signinResp, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.post('/signout', authenticate(), async (req, res) => {
	return Sessions.deleteOne({ token: req.headers.token })
		.then((deletedSession) => {
			return res.status(200).json({ msg: 'singedout', data: deletedSession })
		})
		.catch((err) => errorHandler({ err, res }))
})

module.exports = router
