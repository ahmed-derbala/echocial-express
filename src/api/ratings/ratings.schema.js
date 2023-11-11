const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//const enums = require('../../helpers/enums')
//const schemas = require('../../helpers/schemas')
const { log } = require(`../../core/log`)
const config = require('../../config')

const RatingsSchema = new mongoose.Schema(
	{
		currentValue: {
			type: Number,
			required: true
		},
		history: [
			{
				value: {
					type: Number,
					required: true
				},
				createdAt: {
					type: Date,
					required: true,
					default: Date.now()
				}
			}
		],
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: true
		},
		reputationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'reputations',
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
)

RatingsSchema.plugin(uniqueValidator)

RatingsSchema.index({ userId: 1, reputationId: 1 }, { unique: true })

const RatingsSchemaName = 'ratings'

const RatingsModel = mongoose.model(RatingsSchemaName, RatingsSchema)
RatingsModel.on('index', (error) => {
	if (error) log({ level: config.log.levelNames.error, message: error })
})

module.exports = {
	RatingsModel,
	RatingsSchemaName
}
