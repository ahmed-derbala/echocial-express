const express = require('express')
const router = express.Router()
const config = require(`../../config`)
const { mainData } = require('./index.service')

router.get('/', function (req, res, next) {
	res.render('index/views/index', { title: config.app.name, mainData: mainData() })
})

router.get('/home', function (req, res, next) {
	res.render('index/views/index', { title: config.app.name, mainData: mainData() })
})

module.exports = router
