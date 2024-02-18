const { objectIdValidator } = require('../../core/validation/')
const { checkSchema, body, query } = require('express-validator')

module.exports.updateReputationVld = [body('facebook').notEmpty(), body('facebook.id').notEmpty(), body('facebook.url').notEmpty(), query('reputationId').custom(objectIdValidator)]

module.exports.createReputationVld = [body('facebook').isObject(), body('facebook.id').notEmpty(), body('facebook.url').notEmpty(), body('rating').isObject(), body('rating.currentValue').notEmpty()]

module.exports.getReputationsVld = [query('page').isNumeric().notEmpty().optional(), query('limit').isNumeric().notEmpty().optional(), query('searchText').trim().isString().optional()]
