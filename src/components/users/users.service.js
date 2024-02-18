const { UsersModel } = require(`./users.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const mongoose = require('mongoose')
const { log } = require('../../core/log')
const { createUserRepo, findOneUserRepo } = require('./users.repository')

module.exports.getUsers = async (params) => {
	return paginate({ model: UsersModel })
		.then((users) => {
			return users
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.getProfile = async ({ loginId, userId, req }) => {
	try {
		log({ message: `requesting profile of userId=${userId} ...`, level: 'debug', req })
		if (!loginId) loginId = userId
		let $or = [{ email: loginId }, { userName: loginId }, { 'phone.shortNumber': loginId }]
		if (mongoose.isValidObjectId(loginId)) $or.push({ _id: loginId })

		return UsersModel.findOne({ $or })
			.select('+profile')
			.lean()
			.then((data) => {
				return { status: 200, data }
			})
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createUserSrvc = async ({ email, password }) => {
	try {
		const createdUser = await createUserRepo({ email, password })
		return createdUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateUserSrvc = async ({ identity, newData }) => {
	try {
		const updatedUser = await updateUserRepo({ identity, newData })
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findOneUserSrvc = async ({ filter, select }) => {
	try {
		const user = await findOneUserRepo({ filter, select })
		return user
	} catch (err) {
		return errorHandler({ err })
	}
}
