const express = require('express');
const router = express.Router();
const usersCtrl = require(`./users.controller`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`../../core/utils/error`).validatorCheck;
const { authenticate } = require(`../../core/auth/auth`)




/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/


router.get('/',
  // authenticate(),
  async (req, res) => {
    return usersSrvc.getUsers()
        .then(data => {
            return res.status(200).json(data)
        })
        .catch(err => errorHandler({ err,req, res }))
})

router.get('/profile/:username',
  // authenticate(),
  (req, res) => {
    return usersSrvc.getProfile({username:req.params.username})
        .then(data => {
            return res.status(200).json(data)
        })
        .catch(err => errorHandler({ err,req, res }))
})

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

module.exports = router;
