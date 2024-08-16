const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const phoneSchema = require('../../core/schemas/phone.schema')

const schema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: false
		},
		email: {
			type: String,
			required: true,
			unique: false //true
		},
		phone: {
			type: phoneSchema,
			select: false
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
)

const businessCollection = 'business'

module.exports = {
	BusinessModel: mongoose.model(businessCollection, schema),
	businessCollection
}
