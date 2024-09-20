const express = require('express')
const router = express.Router()
const { authenticate } = require(`../../core/auth`)
const { getidentitiesSrvc, createIdentitySrvc, findOneIdentitySrvc } = require('./identities.service')
const { errorHandler } = require('../../core/utils/error')
const { validate } = require('../../core/validation')
const { createIdentityVld, findOneIdentityVld } = require('./identities.validator')
const { resp } = require('../../core/helpers/resp')

router.get('/', authenticate(), async (req, res) => {
	try {
		const result = await getidentitiesSrvc({ page: req.query.page, limit: req.query.limit, searchText: req.query.searchText })
		return resp({ status: 200, ...result, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

router.post('/create', validate(createIdentityVld), authenticate(), async (req, res) => {
	try {
		const { name, facebook, rating } = req.body
		//check if identity exist
		const identityExists = await findOneIdentitySrvc({ match: { name, facebook } })
		if (identityExists) return resp({ status: 200, label: 'identity_exists', message: 'identity already exists, nothing created', data: identityExists, req, res })

		const identity = await createIdentitySrvc({ name, facebook, rating, createdBy: req.user._id })
		return resp({ status: 200, data: identity, req, res })
	} catch (err) {
		errorHandler({ err, res, req })
	}
})

router.post('/find-one', validate(findOneIdentityVld), async (req, res) => {
	try {
		const { match } = req.body
		const identity = await findOneIdentitySrvc({ match })
		return resp({ status: 200, label: 'find_one_identity', message: 'success', data: identity, req, res })
	} catch (err) {
		errorHandler({ err, res, req })
	}
})

module.exports = router
