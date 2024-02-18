const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const schemas = require('../../helpers/schemas')

const schema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: false
		},
		email: {
			type: String,
			required: true,
			unique: false //true
		},
		phone: {
			type: schemas.phone,
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
