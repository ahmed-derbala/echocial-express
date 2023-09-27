const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const enums = require('../../helpers/enums')
//const schemas = require('../../helpers/schemas')
const { log, levelNames } = require(`../../core/log/log`)


const ReputationsSchema = new mongoose.Schema({
    facebook: {
        id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    instagram: {
        id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },
    linkedin: {
        id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },
    kind: {
        type: String,
        enum: ["users", "shops"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        currentValue: {
            type: Number,
            required: true
        },
        ratersCount:{
            type:Number,
            required:true
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
},
    { timestamps: true });

ReputationsSchema.plugin(uniqueValidator);

ReputationsSchema.index({ 'facebook.id': 1, 'instagram.id': 1,'linkdin.id':1}, { unique: true });

const ReputationsSchemaName = 'reputations'

const ReputationsModel = mongoose.model(ReputationsSchemaName, ReputationsSchema);
ReputationsModel.on('index', (error) => {
    if (error) log({ level: levelNames.error, message: error });
});

module.exports = {
    ReputationsModel,
    ReputationsSchemaName
}