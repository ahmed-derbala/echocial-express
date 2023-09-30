const mongoose = require('mongoose')
const { usersCollection } = require('../users/users.schema')
const { log } = require(`../../core/log/log`)
const conf = require('../../configs/config')

const PostsSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			select: false,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: false,
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
)

const PostsSchemaName = 'posts'

const PostsModel = mongoose.model(PostsSchemaName, PostsSchema)
PostsModel.on('index', (error) => {
	if (error) log({ level: conf.log.levelNames.error, message: error })
})

module.exports = {
	PostsModel,
	PostsSchemaName,
}
