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
		category: {
			type: String,
			enum: enums.categories.products
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users'
		},
		shopId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'shops'
		},
		enterpriseId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'enterprises'
		},
		isActive: {
			type: Boolean,
			default: true
		},
		price: {
			type: schemas.price
		}
	},
	{ timestamps: true }
)

schema.plugin(uniqueValidator)

const productsSchemaName = 'products'

module.exports = {
	ProductsModel: mongoose.model(productsSchemaName, schema),
	productsSchemaName
}
