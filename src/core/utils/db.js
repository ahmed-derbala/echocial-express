const mongoose = require("mongoose")
const conf = require(`../../configs/config`)
const { log, levelNames } = require(`../log/log`)
const { errorHandler } = require("./error")

const connect = async () => {
	try {
		mongoose.set("strictQuery", false)
		await mongoose.connect(conf.db.mongo.uri, conf.db.mongo.options)
		log({
			message: `db-conn-success | ${conf.db.mongo.name} | ${conf.db.mongo.host}:${conf.db.mongo.port}`,
			level: "success"
		})
	} catch (err) {
		errorHandler({ err })
	}

	mongoose.connection
		.on("error", () => {
			log({
				message: `db-conn-error | ${conf.db.mongo.name} | ${conf.db.mongo.host}:${conf.db.mongo.port}`,
				level: "error"
			})
		})
		.on("close", () => {
			log({ message: "db-conn-close", level: levelNames.error })
		})
		.on("disconnected", () => {
			log({ message: "db-conn-disconnecting", level: levelNames.warn })
		})
		.on("disconnected", () => {
			log({ message: "db-conn-disconnected", level: levelNames.error })
		})
		.on("reconnected", () => {
			log({ message: "db-conn-reconnected", level: levelNames.verbose })
		})
		.on("fullsetup", () => {
			log({ message: "db-conn-fullsetup", level: levelNames.verbose })
		})
		.on("all", () => {
			log({ message: "db-conn-all", level: levelNames.verbose })
		})
}

module.exports = {
	connect
}
