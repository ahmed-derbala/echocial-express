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

router.get(
	'/profile/:username',
	// authenticate(),
	(req, res) => {
		return usersSrvc
			.getProfile({ username: req.params.username })
			.then((data) => {
				return res.status(200).json(data)
			})
			.catch((err) => errorHandler({ err, req, res }))
	}
)

router.get('/me/profile/', authenticate(), (req, res) => {
	try {
		return usersSrvc.getMyProfile({ userId: req.user._id }).then((data) => {
			return res.status(200).json({ data, status: 200 })
		})
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.get('/me/reputation', authenticate(), (req, res) => {
	try {
		return usersSrvc.getMyReputation({ userId: req.user._id }).then((data) => {
			return res.status(200).json({ data })
		})
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

module.exports = router
