const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    user_id : {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    access_token : {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Token = mongoose.model('token', tokenSchema);
module.exports = Token;
