const express = require('express')
const router = express.Router()
const usersSrvc = require(`./users.service`)
const { check, query, param } = require('express-validator')
const validatorCheck = require(`../../core/utils/error`).validatorCheck
const { authenticate } = require(`../../core/auth/auth`)
const { errorHandler } = require('../../core/utils/error')

router.get(
	'/',
	// authenticate(),
	async (req, res) => {
		return usersSrvc
			.getUsers()
			.then((data) => {
				return res.status(200).json(data)
			})
			.catch((err) => errorHandler({ err, req, res }))
	}
)

router.get('/profile', authenticate(), (req, res) => {
	try {
		return usersSrvc.getProfile({ loginId: req.query.loginId, userId: req.user._id }).then((data) => {
			return res.status(200).json(data)
		})
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

module.exports = router
