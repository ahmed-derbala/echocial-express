const mongoose = require('mongoose');
const { usersSchemaName } = require('../users/users.schema')
const { log, levelNames } = require(`../../core/log/log`)


const PostsSchema = new mongoose.Schema({
    text: {
        type: String,
        select: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: usersSchemaName,
        required: false
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true });


const PostsSchemaName = 'posts'

const PostsModel = mongoose.model(PostsSchemaName, PostsSchema);
PostsModel.on('index', (error) => {
    if (error) log({ level: levelNames.error, message: error });
});

module.exports = {
    PostsModel,
    PostsSchemaName
}
