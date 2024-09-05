const { objectIdValidator } = require('../../core/validation/')
const { checkSchema, body, query } = require('express-validator')

module.exports.updateReputationVld = [body('facebook').notEmpty(), body('facebook.username').notEmpty(), body('facebook.url').notEmpty(), query('reputationId').custom(objectIdValidator)]

module.exports.createIdentityVld = [body('facebook').isObject(), body('facebook.url').notEmpty(), body('rating').isObject(), body('rating.value').notEmpty()]

module.exports.getidentitiesVld = [query('page').isNumeric().notEmpty().optional(), query('limit').isNumeric().notEmpty().optional(), query('searchText').trim().isString().optional()]
