const mongoose = require('mongoose')
const { UsersModel } = require(`../users/users.schema`)
const Sessions = require(`../sessions/sessions.schema`)
const bcrypt = require('bcrypt')
const { errorHandler } = require('../../core/utils/error')
const jwt = require('jsonwebtoken')
const config = require(`../../config/config`)

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

	return UsersModel.create({ email, password })
		.then((createdUser) => {
			createdUser = createdUser.toJSON()
			delete createdUser.password
			if (createdUser.username == null) {
				return UsersModel.updateOne({ _id: createdUser._id }, { username: createdUser._id })
					.then((updatedUser) => {
						createdUser.username = createdUser._id
						return createdUser
					})
					.catch((err) => errorHandler({ err }))
			}
			return createdUser
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.signin = async ({ email, username, password, req }) => {
	console.log(username, 'username')
	let fetchKey = { email }
	if (username) fetchKey = { username }
	console.log(fetchKey, 'fetchKey')
	return await UsersModel.findOne(fetchKey)
		.lean()
		.select('+password')
		.then((fetchedUser) => {
			if (fetchedUser == null) {
				return { message: 'user not found', data: null, status: 404 }
			}
			//user found, check password
			const passwordCompare = bcrypt.compareSync(password, fetchedUser.password)

			delete fetchedUser.password //we dont need password anymore
			if (passwordCompare == false) {
				return { message: 'password incorrect', data: null, status: 409 }
			}
			const token = jwt.sign({ user: fetchedUser, ip: req.ip, userAgent: req.headers['user-agent'] }, config.auth.jwt.privateKey, { expiresIn: '30d' })

			return Sessions.create({
				token,
				user: fetchedUser,
				headers: req.headers,
				ip: req.ip
			})
				.then((session) => {
					return {
						status: 200,
						message: 'success',
						data: { user: fetchedUser, token }
					}
				})
				.catch((err) => errorHandler({ err }))
		})
		.catch((err) => errorHandler({ err }))
}
