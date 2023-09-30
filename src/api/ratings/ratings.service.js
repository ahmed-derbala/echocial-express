//const { ReputationsModel } = require(`./reputations.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginate } = require('../../core/helpers/pagination')
const { RatingsModel } = require(`./ratings.schema`)
const reputationsSrvc = require('../reputations/reputations.service')

/*
module.exports.getReputations = async (params) => {
    return paginate({ model: ReputationsModel })
        .then(users => {
            return users
        })
        .catch(err => errorHandler({ err }))
}

module.exports.createReputaion = async ({facebook}) => {
    return ReputationsModel.create({facebook})
        .then(createdReputaion => {
            return createdReputaion
        })
        .catch(err => errorHandler({ err }))
}
*/
module.exports.setRating = async ({ currentValue, userId, reputationId }) => {
	const existedRating = await RatingsModel.findOne({ userId, reputationId })
	if (existedRating) {
		//the user already rated this repuattion, update it
		return RatingsModel.updateOne(
			{ _id: existedRating._id },
			{
				currentValue,
				history: {
					$push: {
						value: currentValue,
						createdAt: Date.now(),
					},
				},
			},
		)
			.then(async (updatedRating) => {
				const reputationUpdatedRating = await reputationsSrvc.updateRating({
					reputationId,
					rating: { currentValue },
				})
				return { reputationUpdatedRating, updatedRating }
			})
			.catch((err) => errorHandler({ err }))
	}

	//this is the first time the user create a rating for this reputation
	return RatingsModel.create({
		currentValue,
		history: [{ value: currentValue, createdAt: Date.now() }],
		userId,
		reputationId,
	})
	/*return RatingsModel.create({facebook})
        .then(newRating => {
            return newRating
        })
        .catch(err => errorHandler({ err }))*/
}
