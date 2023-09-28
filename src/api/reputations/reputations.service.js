const { ReputationsModel } = require(`./reputations.schema`)
const { errorHandler } = require("../../core/utils/error")
const { paginate } = require("../../core/helpers/pagination")

module.exports.getReputations = async (params) => {
	return paginate({ model: ReputationsModel })
		.then((users) => {
			return users
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.createReputation = async ({ facebook, rating }) => {
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
		return ReputationsModel.create({ facebook, rating }).then(
			(createdReputation) => {
				return createdReputation
			}
		)
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateRating = async ({ reputationId, rating }) => {
	const fetchedReputation = await ReputationsModel.findOne({
		_id: reputationId
	}).lean()
	if (!fetchedReputation) return null

	rating.ratersCount = fetchedReputation.rating.ratersCount++
	rating.currentValue =
		(fetchedReputation.rating.currentValue + rating.currentValue) /
		rating.ratersCount

	return ReputationsModel.updateOne({ _id: reputationId }, { rating })
		.then((updatedReputaion) => {
			return updatedReputaion
		})
		.catch((err) => errorHandler({ err }))
}
