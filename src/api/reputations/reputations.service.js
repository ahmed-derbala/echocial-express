const { ReputationsModel } = require(`./reputations.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginate } = require('../../core/helpers/pagination')
const { log } = require('../../core/log')

module.exports.getReputations = async ({ page, limit, searchText }) => {
	try {
		let paginateOptions = { model: ReputationsModel, page, limit }
		if (searchText) {
			paginateOptions.match = { 'facebook.id': { $regex: searchText, $options: 'i' } }
		}
		const reputations = await paginate(paginateOptions)
		reputations.status = 200
		return reputations
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.getUserReputation = async ({ userId }) => {
	try {
		const data = await ReputationsModel.findOne({ userId }).lean()
		let status = 200
		if (!data) status = 204
		return { status, data }
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createReputation = async ({ facebook, rating, byUserId }) => {
	try {
		const fetchedReputation = await ReputationsModel.findOne({
			facebook: { id: facebook.id }
		}).lean()
		if (fetchedReputation)
			return {
				error: true,
				message: `facebook.id=${facebook.id} already exists`
			}

		rating.ratersCount = 1
		return ReputationsModel.create({ facebook, rating, byUserId }).then((createdReputation) => {
			return createdReputation
		})
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateRating = async ({ reputationId, rating }) => {
	const fetchedReputation = await ReputationsModel.findOne({
		_id: reputationId
	}).lean()
	if (!fetchedReputation) {
		log({
			level: 'error',
			message: `[reputations.service.updateRating] no reputation found with _id ${reputationId}`
		})
		return null
	}

	rating.ratersCount = fetchedReputation.rating.ratersCount++
	rating.currentValue = (fetchedReputation.rating.currentValue + rating.currentValue) / rating.ratersCount

	return ReputationsModel.updateOne({ _id: reputationId }, { rating })
		.then((updatedReputaion) => {
			return updatedReputaion
		})
		.catch((err) => errorHandler({ err }))
}
