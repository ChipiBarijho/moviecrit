const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewsTMDBSchema = new Schema({
    body: String,
    author: String,
    url: String

})

module.exports = mongoose.model('ReviewsTMDB', reviewsTMDBSchema);