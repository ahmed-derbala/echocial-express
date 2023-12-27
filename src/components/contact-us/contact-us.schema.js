const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const enums = require('../../core/enums/enums')
const schemas = require('../../core/schemas/schemas')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		subject: {
			type: String,
			required: true
		},
		message: {
			type: String,
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users'
		}
	},
	{ timestamps: true }
)

schema.plugin(uniqueValidator)

const contactUsSchemaName = 'contact-us'

module.exports = {
	ContactUsModel: mongoose.model(contactUsSchemaName, schema),
	contactUsSchemaName
}
