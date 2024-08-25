const { reviewsModel } = require(`./reviews.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require('../../core/log')

module.exports.findOneRatingRepo = async ({ filter, select }) => {
	try {
		const rating = await reviewsModel.findOne(filter).select(select).lean()
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.createRatingRepo = async ({ currentValue, userId, reputationId }) => {
	try {
		const history = [{ value: currentValue, createdAt: Date.now() }]
		const rating = await reviewsModel.create({ userId, reputationId, history })
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.updateCurrentValueRepo = async ({ currentValue, userId, reputationId }) => {
	try {
		const history = [{ value: currentValue, createdAt: Date.now() }]
		const rating = await reviewsModel.create({ userId, reputationId, history })
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.updateRatingCurrentValueRepo = async ({ ratingId, newCurrentValue, oldCurrentValue }) => {
	try {
		let newHistoryItem = { value: oldCurrentValue, createdAt: Date.now() }
		const updatedRatingInfos = reviewsModel.updateOne(
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

module.exports.findReviewsRepo = async ({ match, select, page, limit }) => {
	try {
		let paginateMongodbOptions = { match, select, page, limit, populate: 'identityId', model: reviewsModel }
		/*if (searchText) {
			paginateMongodbOptions.match = { 'facebook.id': { $regex: searchText, $options: 'i' } }
		}*/
		return paginateMongodb(paginateMongodbOptions)
	} catch (err) {
		return errorHandler({ err })
	}
}
