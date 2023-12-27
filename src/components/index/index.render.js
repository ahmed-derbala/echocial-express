const express = require('express')
const router = express.Router()
const config = require(`../../config`)

router.get('/', function (req, res, next) {
	const { NODE_ENV, app } = config
	//return res.status(200).json({ NODE_ENV, app })
	res.render('index/views/index', { title: config.app.name })
})

router.get('/home', function (req, res, next) {
	const { NODE_ENV, app } = config
	res.render('index/views/index', { title: config.app.name })
})

module.exports = router
