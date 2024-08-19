//const { ReputationsModel } = require(`./reputations.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { RatingsModel } = require(`./ratings.schema`)
const reputationsSrvc = require('../reputations/reputations.service')
const { findOneRatingRepo, updateRatingCurrentValueRepo } = require('./ratings.repository')
const { log } = require('../../core/log')

module.exports.createOrUpdateRatingSrvc = async ({ userId, currentValue, reputationId }) => {
	const existedRating = await RatingsModel.findOne({
		userId,
		reputationId
	}).lean()
	if (!existedRating) {
		//this is the first time the user create a rating for this reputation
		return RatingsModel.create({
			currentValue,
			history: [{ value: currentValue, createdAt: Date.now() }],
			userId,
			reputationId
		})
	}

	//the user already rated this repuattion, update it
	return RatingsModel.updateOne(
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
			const reputationUpdatedRating = await reputationsSrvc.updateRatingSrvc({
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
