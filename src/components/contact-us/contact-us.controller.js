const express = require('express')
const router = express.Router()
const { check, query, param } = require('express-validator')
const validatorCheck = require(`../../core/utils/error`).validatorCheck
const { authenticate } = require(`../../core/auth`)
const { errorHandler } = require('../../core/utils/error')
const contactUsSrvc = require('./contact-us.service')
const { resp } = require('../../core/helpers/resp')

router.get('/', authenticate(), async (req, res) => {
	try {
		const { page, limit } = req.query
		const contactUsList = await contactUsSrvc.findAll({ page, limit })
		return resp({ status: 200, json: contactUsList, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

router.post('/', [check('name').isString()], validatorCheck, async (req, res) => {
	try {
		const { name, email, subject, message } = req.body
		const newContactUs = await contactUsSrvc.create({ name, email, subject, message, req })
		console.log(newContactUs)
		return resp({ status: 200, json: newContactUs, req, res, redirect: '/contact-us' })
	} catch (err) {
		return errorHandler({ err, req, res })
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
