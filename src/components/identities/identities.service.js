const { IdentitiesModel } = require(`./identities.schema`)
const { errorHandler } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { getidentitiesRepo, findOneIdentityRepo, createIdentityRepo } = require('./identities.repository')

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
		const data = await IdentitiesModel.findOne({ userId }).lean()
		let status = 200
		if (!data) status = 204
		return { status, data }
	} catch (err) {
		errorHandler({ err })
	}
}

function extractFacebookUsername(url) {
	// Regular expression to match Facebook URLs with usernames or IDs
	const usernameRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([A-Za-z0-9.]+)/i
	const idRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/profile\.php\?id=(\d+)/i

	// Check for profile.php?id= pattern first
	const idMatch = url.match(idRegex)
	if (idMatch) {
		return idMatch[1] // Return only the numerical ID
	}

	// If no ID, check for username pattern
	const usernameMatch = url.match(usernameRegex)
	if (usernameMatch) {
		return usernameMatch[1] // Return the username
	}

	return null // Return null if no valid username or ID is found
}

module.exports.createIdentitySrvc = async ({ name, facebook, rating, createdBy }) => {
	try {
		if (!facebook.username) facebook.username = extractFacebookUsername(facebook.url)
		const identity = await createIdentityRepo({ name, facebook, rating, createdBy })
		return identity
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateRatingSrvc = async ({ reputationId, rating }) => {
	const fetchedReputation = await IdentitiesModel.findOne({
		_id: reputationId
	}).lean()
	if (!fetchedReputation) {
		log({
			level: 'error',
			message: `[identities.service.updateRating] no reputation found with _id ${reputationId}`
		})
		return null
	}

	rating.ratersCount = fetchedReputation.rating.ratersCount++
	rating.currentValue = (fetchedReputation.rating.currentValue + rating.currentValue) / rating.ratersCount

	return IdentitiesModel.updateOne({ _id: reputationId }, { rating })
		.then((updatedReputaion) => {
			return updatedReputaion
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.findOneIdentitySrvc = async ({ match, select }) => {
	try {
		const identity = await findOneIdentityRepo({ match, select })
		return identity
	} catch (err) {
		return errorHandler({ err })
	}
}
