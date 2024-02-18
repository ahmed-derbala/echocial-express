const { ReputationsModel } = require(`./reputations.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require('../../core/log')

module.exports.getReputationsRepo = async ({ page, limit, searchText }) => {
	try {
		let paginateMongodbOptions = { model: ReputationsModel, page, limit }
		if (searchText) {
			paginateMongodbOptions.match = { 'facebook.id': { $regex: searchText, $options: 'i' } }
		}
		const reputations = await paginateMongodb(paginateMongodbOptions)
		return reputations
	} catch (err) {
		return errorHandler({ err })
	}
}
