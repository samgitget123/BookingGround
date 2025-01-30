const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone_number:{type: String , required:true , unique:true , unique:true},
    otp:{type: String},
    is_verified: {type:Boolean , default:false},
    created_at: {type: Date , default: Date.now}
});

module.exports = mongoose.model('User' , userSchema);