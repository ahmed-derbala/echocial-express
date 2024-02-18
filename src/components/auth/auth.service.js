const mongoose = require('mongoose')
const { UsersModel } = require(`../users/users.schema`)
const { SessionsModel } = require(`../sessions/sessions.schema`)
const bcrypt = require('bcrypt')
const { errorHandler } = require('../../core/utils/error')
const jwt = require('jsonwebtoken')
const config = require(`../../config`)
const { createUserSrvc, updateUserSrvc, findOneUserSrvc } = require('../users/users.service')

module.exports.signup = async ({ email, password, phone, profile }) => {
	//console.log(params,"servc params")
	const salt = bcrypt.genSaltSync(config.auth.saltRounds)
	password = bcrypt.hashSync(password, salt)
	if (profile && !profile.displayName) profile.displayName = `${profile.firstName} ${profile.lastName}`
	if (phone) {
		phone.countryCode = phone.countryCode.trim()
		phone.shortNUmber = phone.shortNumber.trim()
		phone.fullNumber = `${phone.countryCode}${phone.shortNumber}`
	}

	return createUserSrvc({ email, password })
		.then((createdUser) => {
			createdUser = createdUser.toJSON()
			delete createdUser.password
			if (createdUser.userName == null) {
				return updateUserSrvc({ identity: { _id: createdUser._id }, newData: { userName: createdUser._id } })
					.then((updatedUser) => {
						createdUser.userName = createdUser._id
						return createdUser
					})
					.catch((err) => errorHandler({ err }))
			}
			return createdUser
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.signin = async ({ loginId, password, req }) => {
	try {
		let $or = [{ email: loginId }, { userName: loginId }, { 'phone.shortNumber': loginId }]
		if (mongoose.isValidObjectId(loginId)) $or.push({ _id: loginId })

		let fetchedUser = await findOneUserSrvc({ filter: { $or }, select: '+password +phone email isActive' })
		if (!fetchedUser) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'no user found with that loginId', data: null, status: 409 }
		}
		//user found, check password
		const passwordCompare = bcrypt.compareSync(password, fetchedUser.password)

		delete fetchedUser.password //we dont need password anymore
		if (passwordCompare == false) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'password incorrect', data: null, status: 409 }
		}
		const token = jwt.sign({ user: fetchedUser, req: { ip: req.ip, headers: { 'user-agent': req.headers['user-agent'] } } }, config.auth.jwt.privateKey, { expiresIn: '30d' })

		SessionsModel.create({
			token,
			user: fetchedUser,
			req: {
				headers: req.headers,
				ip: req.ip
			}
		})

		return fetchedUser
	} catch (err) {
		errorHandler({ err })
	}
}
