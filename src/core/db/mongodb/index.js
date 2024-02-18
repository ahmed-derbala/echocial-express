const mongoose = require('mongoose')
const config = require(`../../../config`)
const { log } = require(`../../log`)
const { errorHandler } = require('../../utils/error')

const connectMongodb = async () => {
	try {
		await mongoose.connect(config.db.mongodb.uri, config.db.mongodb.options)
		log({
			message: `db-conn-success | ${config.db.mongodb.name} | ${config.db.mongodb.host}:${config.db.mongodb.port}`,
			level: 'success'
		})
	} catch (err) {
		errorHandler({ err })
	}

	mongoose.connection
		.on('error', () => {
			log({
				message: `db-conn-error | ${config.db.mongodb.name} | ${config.db.mongodb.host}:${config.db.mongodb.port}`,
				level: 'error'
			})
		})
		.on('close', () => {
			log({ message: 'db-conn-close', level: config.log.levelNames.error })
		})
		.on('disconnected', () => {
			log({
				message: 'db-conn-disconnecting',
				level: config.log.levelNames.warn
			})
		})
		.on('disconnected', () => {
			log({
				message: 'db-conn-disconnected',
				level: config.log.levelNames.error
			})
		})
		.on('reconnected', () => {
			log({
				message: 'db-conn-reconnected',
				level: config.log.levelNames.verbose
			})
		})
		.on('fullsetup', () => {
			log({
				message: 'db-conn-fullsetup',
				level: config.log.levelNames.verbose
			})
		})
		.on('all', () => {
			log({ message: 'db-conn-all', level: config.log.levelNames.verbose })
		})
}

module.exports = {
	connectMongodb
}
