#!/usr/bin/env node
console.clear()
const conf = require(`./configs/config`)
if (conf.app.use_strict) require('use-strict')
const { log } = require(`./core/log/log`)
const db = require('./core/utils/db')

db.connect()

process.on('warning', (err) => log({ message: err.stack, level: 'warn' })) //print out memory leak errors
process.on('uncaughtException', (err) =>
	log({ message: err.stack, level: 'warn' }),
)
process.on('unhandledRejection', (err) =>
	log({ message: err.stack, level: 'warn' }),
)

const server = require('./core/utils/server')
const { socketio } = require('./core/socket/socketio')
socketio({ server })
