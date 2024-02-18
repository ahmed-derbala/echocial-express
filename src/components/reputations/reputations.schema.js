const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//const enums = require('../../helpers/enums')
const schemas = require('../../core/schemas')
const { log } = require(`../../core/log`)
const config = require('../../config')

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
			type: schemas.phone
		},
		kind: {
			type: String,
			enum: ['users', 'shops']
		},
		userId: {
			//the user who the reputation belongs to
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users'
		},
		byUserId: {
			//the user who created the reputation
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
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

const ReputationsCollection = 'reputations'

const ReputationsModel = mongoose.model(ReputationsCollection, ReputationsSchema)
ReputationsModel.on('index', (error) => {
	if (error) log({ level: config.log.levels.names.error, message: error })
})

module.exports = {
	ReputationsModel,
	ReputationsCollection
}
