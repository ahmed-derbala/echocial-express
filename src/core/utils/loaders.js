const fs = require('fs')
const { log } = require(`../log`)

module.exports.routes = (app) => {
	let directories = fs.readdirSync(`${process.cwd()}/src/api/`)
	let endpoint_root, files
	for (const dir of directories) {
		files = fs.readdirSync(`${process.cwd()}/src/api/${dir}`)
		if (files.length > 0) {
			for (const file of files) {
				if (file.includes('.controller.js')) {
					endpoint_root = file.substring(0, file.indexOf('.controller.js'))
					app.use(`/api/${endpoint_root}`, require(`${process.cwd()}/src/api/${dir}/${file}`))
				}
			}
		}
	}
	app.use(`/`, require(`${process.cwd()}/src/api/index/index.controller`)) //make sure main url works with src/index
	log({ level: 'success', message: 'routes loaded' })
}
