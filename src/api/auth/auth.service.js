const mongoose = require('mongoose');
const { UsersSchema } = require(`../users/users.schema`)
const Sessions = require(`../sessions/sessions.schema`)
const bcrypt = require('bcrypt');
const { errorHandler } = require('../../core/utils/error');
const jwt = require('jsonwebtoken');
const conf = require(`../../configs/config`)

module.exports.signup = async ({ email, password, phone, profile }) => {
    //console.log(params,"servc params")
    const salt = bcrypt.genSaltSync(conf.auth.saltRounds)
    password = bcrypt.hashSync(password, salt)
    if (profile && !profile.displayname) profile.displayname = `${profile.firstname} ${profile.lastname}`
    if (phone) {
        phone.countryCode = phone.countryCode.trim()
        phone.shortNUmber = phone.shortNumber.trim()
        phone.fullNumber = `${phone.countryCode}${phone.shortNumber}`
    }


    return UsersSchema.create({ email, password })
        .then(createdUser => {
            createdUser = createdUser.toJSON()
            delete createdUser.password
            if (createdUser.username == null) {
                return UsersSchema.updateOne({ _id: createdUser._id }, { username: createdUser._id })
                    .then(updatedUser => {
                        createdUser.username = createdUser._id
                        return createdUser
                    })
                    .catch(err => errorHandler({ err }))
            }
            return createdUser
        })
        .catch(err => errorHandler({ err }))
}

module.exports.signin = async ({ email,username, password, req }) => {
    console.log(username,'username');
    let fetchKey={email}
    if(username)fetchKey={username}
    console.log(fetchKey,'fetchKey');
    return await UsersSchema.findOne(fetchKey).lean().select('+password')
        .then(fetchedUser => {
            if (fetchedUser == null) {
                return { message: 'user not found', data: null, status: 404 }
            }
            //user found, check password
            const passwordCompare = bcrypt.compareSync(password, fetchedUser.password)

            delete fetchedUser.password//we dont need password anymore
            if (passwordCompare == false) {
                return { message: 'password incorrect', data: null, status: 409 }
            }
            const token = jwt.sign({ user:fetchedUser, ip: req.ip, userAgent: req.headers['user-agent'] }, conf.auth.jwt.privateKey, { expiresIn: '30d' })

            return Sessions.create({ token, user: fetchedUser, headers: req.headers, ip: req.ip })
                .then(session => {
                    return { status: 200, message: 'success', data: { user: fetchedUser, token }, }
                })
                .catch(err => errorHandler({ err }))
        })
        .catch(err => errorHandler({ err }))
}