const express = require('express')
const router = express.Router()
const postsCtrl = require(`./posts.controller`)
const { check, query, param } = require('express-validator')
const validatorCheck = require(`../../core/utils/error`).validatorCheck
const { authenticate } = require(`../../core/auth`)
const postsService = require('./posts.service')

/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.post(
	'/',
	// authenticate(),
	async (req, res) => {
		const createdpost = await postsService.create({ post: req.body })
		//console.log(JSON.stringify(createdpost),'createdpost');
		return res.status(201).json(createdpost)
	}
)

/*
router.post('/signin',
[
    check('email').isEmail(),
    check('password').isString().notEmpty()
],
validatorCheck,
auth_ctrl.signin)
*/

/*
router.post('/signup',
[
    check('email').isEmail(),
    check('password').isString().notEmpty()
],
validatorCheck,
authController.signup)*/

module.exports = router
