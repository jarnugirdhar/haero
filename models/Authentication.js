const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthenticationSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = Authentication = mongoose.model('authentication', AuthenticationSchema);