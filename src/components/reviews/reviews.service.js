//const { identitiesModel } = require(`./identities.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { reviewsModel } = require(`./reviews.schema`)
const identitiesSrvc = require('../identities/identities.service')
const { findOneRatingRepo, updateRatingCurrentValueRepo, findReviewsRepo } = require('./reviews.repository')
const { log } = require('../../core/log')

module.exports.createOrUpdatereviewsrvc = async ({ userId, currentValue, reputationId }) => {
	const existedRating = await reviewsModel
		.findOne({
			userId,
			reputationId
		})
		.lean()
	if (!existedRating) {
		//this is the first time the user create a rating for this reputation
		return reviewsModel.create({
			currentValue,
			history: [{ value: currentValue, createdAt: Date.now() }],
			userId,
			reputationId
		})
	}

	//the user already rated this repuattion, update it
	return reviewsModel
		.updateOne(
			{ _id: existedRating._id },
			{
				currentValue,
				history: {
					$push: {
						value: currentValue,
						createdAt: Date.now()
					}
				}
			}
		)
		.then(async (updatedRating) => {
			const reputationUpdatedRating = await identitiesSrvc.updatereviewsrvc({
				reputationId,
				rating: { currentValue }
			})
			return { reputationUpdatedRating, updatedRating }
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.updateRatingCurrentValueSrvc = async ({ currentValue, userId, reputationId }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const fetchedRating = await findOneRatingRepo({ reputationId, userId })
			if (!fetchedRating) {
				log({ level: 'warn', message: `no rating found with ${JSON.stringify({ userId, reputationId })}` })
				return resolve(null)
			}

			const updatedRatingInfos = await updateRatingCurrentValueRepo({ ratingId, newCurrentValue: currentValue, oldCurrentValue: fetchedRating.currentValue })
			resolve(updatedRatingInfos)
		} catch (err) {
			reject(errorHandler({ err }))
		}
	})
}

module.exports.findReviews = async ({ match, select, page, limit }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const fetchedReviews = await findReviewsRepo({ match, select, page, limit })
			return resolve(fetchedReviews)
		} catch (err) {
			reject(errorHandler({ err }))
		}
	})
}
