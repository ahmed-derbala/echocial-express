const { UsersModel } = require(`./users.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginate } = require('../../core/helpers/pagination')
const { ReputationsModel } = require(`../reputations/reputations.schema`)
const mongoose = require('mongoose')
const { log } = require('../../core/log')

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
