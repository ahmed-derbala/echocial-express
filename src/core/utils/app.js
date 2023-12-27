const express = require('express')
const cookieParser = require('cookie-parser')
const useragent = require('express-useragent')
const expressWinston = require('express-winston')
const winston = require('winston') //logging module
const loaders = require('./loaders')
const morganLogger = require(`../log/morgan`)
const rateLimit = require('express-rate-limit')
const config = require(`../../config`)
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const { tidHandler } = require('../helpers/tid')
const { errorHandler } = require('./error')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../swagger/swagger')
const expressLayouts = require('express-ejs-layouts')

let app = express()

// view engine setup
app.use(expressLayouts)
app.set('layout', './index/views/layout')
app.set('views', `${process.cwd()}/src/components`)
app.set('view engine', 'ejs')
app.use(express.static(`${process.cwd()}/public`))

app.use(cors(config.app.corsOptions))
app.use('/', rateLimit(config.app.apiLimiter))
app.use(compression())
if (config.app.helmet.isActive) app.use(helmet(config.app.helmet.options))
app.use(tidHandler)
app.use(useragent.express())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.disable('x-powered-by')
app.disable('etag')
app.use(morganLogger())

//save logs to db
app.use(
	expressWinston.logger({
		transports: [new winston.transports.MongoDB(config.log.transportsOptions.mongo)],
		expressFormat: true
	})
)

app.use(config.app.swagger.endpoint, swaggerUi.serve, swaggerUi.setup(swaggerSpec.mainDef))

loaders.load({ app, rootDir: '/components', urlPrefix: '/', fileSuffix: '.render.js' }) //load views
loaders.load({ app, rootDir: '/components', urlPrefix: '/api/', fileSuffix: '.controller.js' }) //load api

//when no api route matched
app.use((req, res, next) => {
	return res.status(404).json({ message: `${req.originalUrl} does not exist`, data: null })
})

//when error occurs
app.use((err, req, res, next) => {
	return errorHandler({ err, req, res })
})

module.exports = app
