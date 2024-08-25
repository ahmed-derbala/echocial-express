const { identitiesModel } = require(`./identities.schema`)
const { errorHandler } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { getidentitiesRepo } = require('./identities.repository')

module.exports.getidentitiesSrvc = async ({ page, limit, searchText }) => {
	try {
		const identities = await getidentitiesRepo({ page, limit, searchText })
		return identities
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.getUseridentitiesrvc = async ({ userId }) => {
	try {
		const data = await identitiesModel.findOne({ userId }).lean()
		let status = 200
		if (!data) status = 204
		return { status, data }
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createidentitiesrvc = async ({ facebook, rating, createdBy }) => {
	try {
		const fetchedReputation = await identitiesModel
			.findOne({
				facebook: { id: facebook.id }
			})
			.lean()
		if (fetchedReputation)
			return {
				error: true,
				message: `facebook.id=${facebook.id} already exists`
			}

		rating.ratersCount = 1
		const createdReputation = await identitiesModel.create({ facebook, rating, createdBy })
		return createdReputation
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateRatingSrvc = async ({ reputationId, rating }) => {
	const fetchedReputation = await identitiesModel
		.findOne({
			_id: reputationId
		})
		.lean()
	if (!fetchedReputation) {
		log({
			level: 'error',
			message: `[identities.service.updateRating] no reputation found with _id ${reputationId}`
		})
		return null
	}

	rating.ratersCount = fetchedReputation.rating.ratersCount++
	rating.currentValue = (fetchedReputation.rating.currentValue + rating.currentValue) / rating.ratersCount

	return identitiesModel
		.updateOne({ _id: reputationId }, { rating })
		.then((updatedReputaion) => {
			return updatedReputaion
		})
		.catch((err) => errorHandler({ err }))
}
