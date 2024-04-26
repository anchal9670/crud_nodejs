const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', 
    },
    token : {
        type : String,
        required : true,
    },
    created_at : {
        type : Date,
        default : Date.now(),
    },
    expired_at : {
        type : Date,
        expires : 0,
    }
})

module.exports = mongoose.model("Token",tokenSchema);