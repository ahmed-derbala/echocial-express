const { PostsModel } = require(`./posts.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginate } = require('../../core/helpers/pagination')

module.exports.create = ({ post }) => {
	return new Promise((resolve, reject) => {
		return PostsModel.create(post)
			.then((createdPost) => {
				resolve(createdPost)
			})
			.catch((err) => {
				reject(errorHandler({ err }))
			})
	})
}
