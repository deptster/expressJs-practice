const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email : {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    first_name : {
        type: String,
        required: true
    },
    last_name : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
