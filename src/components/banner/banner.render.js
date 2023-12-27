const express = require('express')
const router = express.Router()
const config = require(`../../config`)

router.get('/', function (req, res, next) {
	res.render('banner/views/banner', { videoFilePath: config.app.name })
})

module.exports = router
