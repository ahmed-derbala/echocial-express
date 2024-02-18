const { UsersModel } = require(`./users.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')

module.exports.createUserRepo = async ({ email, password }) => {
	try {
		const createdUser = await UsersModel.create({ email, password })
		return createdUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateUserRepo = async ({ identity, newData }) => {
	try {
		const updatedUser = await UsersModel.updateOne(identity, newData)
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findOneUserRepo = async ({ filter, select }) => {
	try {
		const user = await UsersModel.findOne(filter).select(select).lean()
		return user
	} catch (err) {
		return errorHandler({ err })
	}
}
