const { RatingsModel } = require(`./ratings.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require('../../core/log')

module.exports.findOneRatingRepo = async ({ filter, select }) => {
	try {
		const rating = await RatingsModel.findOne(filter).select(select).lean()
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.createRatingRepo = async ({ currentValue, userId, reputationId }) => {
	try {
		const history = [{ value: currentValue, createdAt: Date.now() }]
		const rating = await RatingsModel.create({ userId, reputationId, history })
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.updateCurrentValueRepo = async ({ currentValue, userId, reputationId }) => {
	try {
		const history = [{ value: currentValue, createdAt: Date.now() }]
		const rating = await RatingsModel.create({ userId, reputationId, history })
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.updateRatingCurrentValueRepo = async ({ ratingId, newCurrentValue, oldCurrentValue }) => {
	try {
		let newHistoryItem = { value: oldCurrentValue, createdAt: Date.now() }
		const updatedRatingInfos = RatingsModel.updateOne(
			{
				_id: ratingId
			},
			{
				currentValue: newCurrentValue,
				$push: { history: newHistoryItem }
			}
		)
		return updatedRatingInfos
	} catch (err) {
		return errorHandler({ err })
	}
}
