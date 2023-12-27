const express = require('express')
const router = express.Router()
const usersSrvc = require(`./users.service`)
const { check, query, param } = require('express-validator')
const { authenticate } = require(`../../core/auth`)
const { errorHandler, validatorCheck } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { resp } = require('../../core/helpers/resp')

router.get('/', authenticate(), async (req, res) => {
	return usersSrvc
		.getUsers()
		.then((data) => {
			return res.status(200).json(data)
		})
		.catch((err) => errorHandler({ err, req, res }))
})

router.get('/profile', authenticate(), async (req, res) => {
	try {
		const profile = await usersSrvc.getProfile({ loginId: req.query.loginId, userId: req.user._id, req })
		return resp({ status: 200, data: profile, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

module.exports = router
