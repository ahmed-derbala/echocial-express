const { identitiesModel } = require(`./identities.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require('../../core/log')

module.exports.getidentitiesRepo = async ({ page, limit, searchText }) => {
	try {
		let paginateMongodbOptions = { model: identitiesModel, page, limit }
		if (searchText) {
			paginateMongodbOptions.match = { 'facebook.id': { $regex: searchText, $options: 'i' } }
		}
		const identities = await paginateMongodb(paginateMongodbOptions)
		return identities
	} catch (err) {
		return errorHandler({ err })
	}
}
