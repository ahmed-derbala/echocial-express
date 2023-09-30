const { UsersModel } = require(`./users.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginate } = require('../../core/helpers/pagination')
const { ReputationsModel } = require(`../reputations/reputations.schema`)

module.exports.getUsers = async (params) => {
	return paginate({ model: UsersModel })
		.then((users) => {
			return users
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.getProfile = async ({ username }) => {
	return UsersModel.findOne({ username })
		.select('profile')
		.lean()
		.then((user) => {
			return user
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.getMyProfile = async ({ username }) => {
	try {
		return (
			UsersModel.findOne({ username })
				//.select("profile")
				.lean()
				.then((user) => {
					return user
				})
		)
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.getMyReputation = async ({ userId }) => {
	try {
		return ReputationsModel.findOne({ userId }).lean()
	} catch (err) {
		errorHandler({ err })
	}
}
