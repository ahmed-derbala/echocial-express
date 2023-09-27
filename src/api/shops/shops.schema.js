const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const enums = require('../../helpers/enums')
const schemas = require('../../helpers/schemas')
const { log, levelNames } = require(`../../utils/log`)


const ShopsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: false//true
    },
    phone: {
        type: schemas.phone,
        select: false
    },
    category: {
        type: string,
        enum: enums.categories.Shops,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    enterpriseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'enterprises',
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true });

ShopsSchema.plugin(uniqueValidator);

const ShopsSchemaName = 'shops'

const ShopsModel = mongoose.model(ShopsSchemaName, ShopsSchema);
ShopsModel.on('index', (error) => {
    if (error) log({ level: levelNames.error, message: error });
});

module.exports = {
    ShopsModel,
    ShopsSchemaName
}