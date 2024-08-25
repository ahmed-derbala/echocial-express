const { objectIdValidator } = require('../../core/validation')
const { body, query } = require('express-validator')

module.exports.patchRatingVld = [body('currentValue').notEmpty().isNumeric(), body('reputationId').custom(objectIdValidator)]

module.exports.createRatingVld = [body('currentValue').notEmpty().isNumeric(), body('reputationId').notEmpty()]
