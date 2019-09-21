const mongoose        = require('mongoose');

//Schema Setup
const commentSchema = mongoose.Schema({
    text: String,
    author: String
})

module.exports = mongoose.model('Comment', commentSchema);