const fs = require('fs')
const { log } = require(`../log`)

/**
 *
 * @param {string} rootDir sub directory of /src , starts with /
 * @param {string} urlPrefix starts with / and ends with /
 * @param {string} filesSuffix starts with . and ends with .extension
 */
module.exports.load = ({ app, rootDir, urlPrefix, fileSuffix }) => {
	let loadedFilesCount = 0
	let directories = fs.readdirSync(`${process.cwd()}/src${rootDir}/`)
	let endpoint_root, files
	for (const dir of directories) {
		files = fs.readdirSync(`${process.cwd()}/src${rootDir}/${dir}`)
		if (files.length > 0) {
			for (const file of files) {
				if (file.includes(fileSuffix)) {
					loadedFilesCount++
					endpoint_root = file.substring(0, file.indexOf(fileSuffix))
					app.use(`${urlPrefix}${endpoint_root}`, require(`${process.cwd()}/src${rootDir}/${dir}/${file}`))
				}
			}
		}
	}
	app.use(`/`, require(`${process.cwd()}/src${rootDir}/index/index${fileSuffix}`)) //make sure main url works with src/index
	log({ level: 'success', message: `${loadedFilesCount} ${fileSuffix} routes loaded` })
}

/**
 * require multiple files based on file name suffix
 * @param {*} param0
 */
module.exports.batchRequire = ({ fileSuffix, rootDir, params, message }) => {
	let loadedFilesCount = 0
	let directories = fs.readdirSync(`${process.cwd()}/src${rootDir}/`)
	for (const dir of directories) {
		files = fs.readdirSync(`${process.cwd()}/src${rootDir}/${dir}`)
		if (files.length > 0) {
			for (const file of files) {
				if (file.includes(fileSuffix)) {
					loadedFilesCount++
					if (params) {
						require(`${process.cwd()}/src${rootDir}/${dir}/${file}`)(params)
					} else {
						require(`${process.cwd()}/src${rootDir}/${dir}/${file}`)
					}
				}
			}
		}
	}

	if (!message) message = `${loadedFilesCount} ${fileSuffix} files loaded`
	log({ level: 'success', message })
}
