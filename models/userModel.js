const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname : {
        type : String,
    },
    gender : {
        type : String,
    },
    profilePic : {
        type : String,
    },
    address : {
        type : String,
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
