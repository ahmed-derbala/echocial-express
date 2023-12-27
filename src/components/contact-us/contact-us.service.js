const mongoose = require('mongoose')
const { ContactUsModel } = require(`./contact-us.schema`)
const Sessions = require(`../sessions/sessions.schema`)
const bcrypt = require('bcrypt')
const { errorHandler } = require('../../core/utils/error')
const jwt = require('jsonwebtoken')
const config = require(`../../config`)
const { paginate } = require('../../core/helpers/pagination')
const { log } = require('../../core/log')

module.exports.findAll = async ({ page, limit }) => {
	try {
		return new Promise((resolve, reject) => {
			return paginate({ model: ContactUsModel, page, limit })
				.then((products) => {
					resolve(products)
				})
				.catch((err) => {
					reject(errorHandler({ err }))
				})
		})
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.create = async ({ name, email, subject, message, req }) => {
	try {
		log({ message: `creating a contact-us`, level: 'debug', req })

		/*	return new Promise((resolve, reject) => {
			return ContactUsModel.create({ name, email, subject, message })
				.then((product) => {
					resolve(product)
				})
				.catch((err) => {
					reject(errorHandler({ err }))
				})
		})*/
		const newContactUs = await ContactUsModel.create({ name, email, subject, message })
		return newContactUs
	} catch (err) {
		return errorHandler({ err })
	}
}
