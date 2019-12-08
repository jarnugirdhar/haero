const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserDetailSchema = new Schema({
    user_id: String,
    air_cash: Number,
    last_booking_id: String,
    previous_bookings: [String]
});

module.exports = UserDetails = mongoose.model('user_details', UserDetailSchema);