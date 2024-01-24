const mongoose = require('mongoose')
const { ProductsModel } = require(`./products.schema`)
const Sessions = require(`../sessions/sessions.schema`)
const bcrypt = require('bcrypt')
const { errorHandler } = require('../../core/utils/error')
const jwt = require('jsonwebtoken')
const config = require(`../../config`)
const { paginate } = require('../../core/helpers/pagination')

module.exports.findAll = async ({ page, limit }) => {
	try {
		return new Promise((resolve, reject) => {
			return paginate({ model: ProductsModel, page, limit })
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

module.exports.create = async ({ name }) => {
	try {
		return new Promise((resolve, reject) => {
			return ProductsModel.create({ name })
				.then((product) => {
					resolve(product)
				})
				.catch((err) => {
					reject(errorHandler({ err }))
				})
		})
	} catch (err) {
		return errorHandler({ err })
	}
}
