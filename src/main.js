#!/usr/bin/env node
'use strict'
//console.clear()
const fs = require('fs')
/*
if (process.env.NODE_ENV) {
	const envFilePath = `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`
	if (fs.existsSync(envFilePath)) {
		envConfig = require(envFilePath)
	} else {
		console.log(`specific ${envFilePath} was not found. loading config.js only`)
	}
}
*/
const defaultConfigFilePath = `${process.cwd()}/src/config/index.js`
if (!fs.existsSync(defaultConfigFilePath)) {
	console.error(`${defaultConfigFilePath} is required.`)
	if (process.env.NODE_ENV) {
		const envConfigFilePath = `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`
		if (fs.existsSync(envConfigFilePath)) {
			console.log(`${envConfigFilePath} is optionnal.`)
		}
	}
	process.exit(1)
}

const { log } = require(`./core/log`)
const db = require('./core/utils/db')

db.connect()

process.on('warning', (err) => log({ message: err.stack, level: 'warn' })) //print out memory leak errors
process.on('uncaughtException', (err) => log({ message: err.stack, level: 'warn' }))
process.on('unhandledRejection', (err) => log({ message: err.stack, level: 'warn' }))

const server = require('./core/utils/server')
const { socketio } = require('./core/socket/socketio')
socketio({ server })
