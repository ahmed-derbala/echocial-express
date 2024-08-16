const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//const enums = require('../../helpers/enums')
const { log } = require(`../../core/log`)
const config = require('../../config')
const { usersCollection } = require('../users/users.schema')
const phoneSchema = require('../../core/schemas/phone.schema')

const ReputationsSchema = new mongoose.Schema(
	{
		facebook: {
			id: {
				type: String,
				required: true
			},
			url: {
				type: String,
				required: true
			}
		},
		instagram: {
			id: {
				type: String,
				required: false
			},
			url: {
				type: String,
				required: false
			}
		},
		linkedin: {
			id: {
				type: String,
				required: false
			},
			url: {
				type: String,
				required: false
			}
		},
		phone: {
			type: phoneSchema
		},
		kind: {
			type: String,
			enum: ['users', 'shops']
		},
		userId: {
			//the user who the reputation belongs to, optionnal
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection
		},
		byUserId: {
			//the user who created the reputation
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		},
		rating: {
			currentValue: {
				type: Number,
				required: true
			},
			ratersCount: {
				type: Number,
				required: true
			},
			updatedAt: {
				type: Date,
				default: Date.now()
			}
		}
	},
	{ timestamps: true }
)

ReputationsSchema.plugin(uniqueValidator)

ReputationsSchema.index({ 'facebook.id': 1, 'instagram.id': 1, 'linkdin.id': 1 }, { unique: true })

const reputationsCollection = 'reputations'

const ReputationsModel = mongoose.model(reputationsCollection, ReputationsSchema)
ReputationsModel.on('index', (error) => {
	if (error) log({ level: config.log.levels.names.error, message: error })
})

module.exports = {
	ReputationsModel,
	reputationsCollection
}
