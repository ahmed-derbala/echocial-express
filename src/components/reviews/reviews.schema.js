const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { log } = require(`../../core/log`)
const config = require('../../config')
const { langEnum } = require('../../core/enums/lang.enum')
const { identitiesCollection } = require('../identities/identities.schema')
const schema = new mongoose.Schema(
	{
		story: {
			text: {
				type: String,
				required: false
			},
			lang: {
				type: String,
				required: false,
				enum: langEnum
			}
		},
		value: {
			type: Number,
			required: true
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: true
		},
		identityId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: identitiesCollection,
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
)

schema.plugin(uniqueValidator)

schema.index({ userId: 1, reputationId: 1 }, { unique: true })

const reviewsCollection = 'reviews'

const reviewsModel = mongoose.model(reviewsCollection, schema)
reviewsModel.on('index', (error) => {
	if (error) log({ level: config.log.levelNames.error, message: error })
})

module.exports = {
	reviewsModel,
	reviewsCollection
}
