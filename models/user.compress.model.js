const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    title: {
        type: String
    },
    link: {
        type: String
    },
    note: {
        type: String
    },
    pipeId: {
        type: String
    }, 
    fileName: {
        type: String
    },
}, {
    collection: 'users'
})
module.exports = mongoose.model('User', userSchema)
