const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user_id : {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    state : {
        type: String,
        required: true
    },
    pin_code : {
        type: Number,
        required: true
    },
    phone_no : {
        type: Number,
        required: true
    }
});

const Address = mongoose.model('address', addressSchema);
module.exports = Address;
