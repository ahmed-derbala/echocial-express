const express = require('express')
const router = express.Router()
const usersSrvc = require(`./users.service`)
const { authenticate, createNewSession } = require(`../../core/auth`)
const { errorHandler } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { resp } = require('../../core/helpers/resp')
const { signinVld, signupVld } = require('./users.validator')
const { validate } = require('../../core/validation')
const { findOneUserSrvc, signinSrvc, createUserSrvc } = require('./users.service')
const { pickOneFilter } = require('./users.helper')

router.get('/:username', authenticate(), async (req, res) => {
	const { username } = req.params
	const user = await findOneUserSrvc({ match: { username } })
	if (!user) return resp({ status: 202, message: 'user not found', data: null, req, res })
	return resp({ status: 200, message: 'user found', data: user, req, res })
})

router.get('/profile', authenticate(), async (req, res) => {
	try {
		const profile = await usersSrvc.getProfile({ loginId: req.query.loginId, userId: req.user._id, req })
		return resp({ status: 200, data: profile, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.post('/signup', validate(signupVld), async (req, res) => {
	const { email, username, phone, password } = req.body
	const match = pickOneFilter({ filters: { email, username, phone } })
	const existedUser = await findOneUserSrvc({ match, select: '_id' })
	if (existedUser) {
		return resp({ status: 409, message: 'user already exist', data: null, req, res })
	}

	const user = await createUserSrvc({ email, username, phone, password })
	if (!user) return resp({ status: 400, data: null, message: 'no auth data was created', req, res })

	const token = createNewSession({ user, req })

	return resp({ status: 200, data: { user, token }, req, res })
})

router.post('/signin', validate(signinVld), async (req, res) => {
	try {
		const { email, username, phone, password } = req.body
		const filter = pickOneFilter({ filters: { email, username, phone } })
		const user = await signinSrvc({ filter, password, select: '_id' })
		if (!user) return resp({ status: 400, data: null, message: `no user found with ${filter}`, req, res })

		const token = createNewSession({ user, req })
		return resp({ status: 200, data: { user, token }, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.post('/signout', authenticate(), async (req, res) => {
	return Sessions.deleteOne({ token: req.headers.token })
		.then((deletedSession) => {
			return res.status(200).json({ message: 'singedout', data: deletedSession })
		})
		.catch((err) => errorHandler({ err, res }))
})
module.exports = router
