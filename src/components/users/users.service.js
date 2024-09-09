const { UsersModel } = require(`./users.schema`)
const { errorHandler } = require('../../core/utils/error')
const mongoose = require('mongoose')
const { log } = require('../../core/log')
const { createUserRepo, findOneUserRepo, updateUserRepo } = require('./users.repository')
const bcrypt = require('bcrypt')
const config = require(`../../config`)
const { makeAuthKeyQuery } = require('./users.helper')

module.exports.getUsers = async (params) => {
	return paginate({ model: UsersModel })
		.then((users) => {
			return users
		})
		.catch((err) => errorHandler({ err }))
}

module.exports.getProfile = async ({ loginId, userId, req }) => {
	try {
		log({ message: `requesting profile of userId=${userId} ...`, level: 'debug', req })
		if (!loginId) loginId = userId
		let $or = [{ email: loginId }, { username: loginId }, { 'phone.shortNumber': loginId }]
		if (mongoose.isValidObjectId(loginId)) $or.push({ _id: loginId })

		return UsersModel.findOne({ $or }).select('+profile').lean()
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateUserSrvc = async ({ identity, newData }) => {
	try {
		const updatedUser = await updateUserRepo({ identity, newData })
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findOneUserSrvc = async ({ filter, select }) => {
	try {
		const user = await findOneUserRepo({ filter, select })
		return user
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.createUserSrvc = async ({ email, username, phone, password }) => {
	const salt = bcrypt.genSaltSync(config.auth.saltRounds)
	password = bcrypt.hashSync(password, salt)

	const signedupUser = await createUserRepo({ email, username, phone, password })
	if (!signedupUser) return null
	return signedupUser

	/*if (profile && !profile.displayName) profile.displayName = `${profile.firstName} ${profile.lastName}`
	if (phone) {
		phone.countryCode = phone.countryCode.trim()
		phone.shortNUmber = phone.shortNumber.trim()
		phone.fullNumber = `${phone.countryCode}${phone.shortNumber}`
	}

	
	return createUserSrvc({ email, password })
		.then((createdUser) => {
			createdUser = createdUser.toJSON()
			delete createdUser.password
			if (createdUser.username == null) {
				return updateUserSrvc({ identity: { _id: createdUser._id }, newData: { username: createdUser._id } })
					.then((updatedUser) => {
						createdUser.username = createdUser._id
						return createdUser
					})
					.catch((err) => errorHandler({ err }))
			}
			return createdUser
		})
		.catch((err) => errorHandler({ err }))
		*/
}

module.exports.signinSrvc = async ({ filter, password }) => {
	try {
		let user = await findOneUserSrvc({ filter, select: { _id: 1, password: 1 } })
		if (!user) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'no user found with that loginId', data: null, status: 409 }
		}
		//user found, check password
		const passwordCompare = bcrypt.compareSync(password, user.password)

		delete user.password //we dont need password anymore
		if (passwordCompare == false) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'password incorrect', data: null, status: 409 }
		}

		return user
	} catch (err) {
		errorHandler({ err })
	}
}

const findOneUserSrvc = (module.exports.findOneUserSrvc = async ({ match, select }) => {
	try {
		//log({ level: 'debug', data: { match, select } })
		const fetchedUser = await findOneUserRepo({ match, select })
		return fetchedUser
	} catch (err) {
		errorHandler({ err })
	}
})
