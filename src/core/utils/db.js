const mongoose = require('mongoose')
const config = require(`../../config`)
const { log } = require(`../log`)
const { errorHandler } = require('./error')

const connect = async () => {
	try {
		await mongoose.connect(config.db.mongo.uri, config.db.mongo.options)
		log({
			message: `db-conn-success | ${config.db.mongo.name} | ${config.db.mongo.host}:${config.db.mongo.port}`,
			level: 'success'
		})
	} catch (err) {
		errorHandler({ err })
	}

	mongoose.connection
		.on('error', () => {
			log({
				message: `db-conn-error | ${config.db.mongo.name} | ${config.db.mongo.host}:${config.db.mongo.port}`,
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
	connect
}
