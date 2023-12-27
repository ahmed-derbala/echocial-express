const express = require('express')
const router = express.Router()
const config = require(`../../config`)

router.get('/', function (req, res, next) {
	res.render('carousel/views/carousel', { title: config.app.name })
})

module.exports = router
