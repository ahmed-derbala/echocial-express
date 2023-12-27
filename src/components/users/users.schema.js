const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const config = require(`../../config`)
const schemas = require('../../core/schemas/schemas')
const enums = require('../../core/enums/enums')

const schema = new mongoose.Schema(
	{
		profile: {
			type: schemas.profile,
			select: false
		},
		userName: {
			type: String,
			required: false
		},
		email: {
			type: String,
			required: true,
			unique: false //true
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		phone: {
			type: schemas.phone,
			select: false
		},
		role: {
			type: Object,
			enum: config.users.roles,
			default: config.users.roles[0]
		},
		type: {
			type: Object,
			enum: config.users.types,
			default: config.users.types[0]
		},
		isActive: {
			type: Boolean,
			default: true
		},
		jobs: [
			{
				name: {
					type: String,
					enum: enums.jobs.names
				},
				shopId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'shops'
				}
			}
		],
		address: {
			type: schemas.address,
			select: false
		}
	},
	{ timestamps: true }
)

schema.plugin(uniqueValidator)
const usersCollection = 'users'

module.exports = {
	UsersModel: mongoose.model(usersCollection, schema),
	usersCollection
}
