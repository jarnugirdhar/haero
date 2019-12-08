const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user_id: String,
    booking_id: String,
    OriginStation: String,
    DestinationStation: String,
    DepartureName: String,
    ArrivalName: String,
    DepartureDateTime: String,
    ArrivalDateTime: String,
    pnr: String,
    price: Number,
    invoice_number: String,
    luggage_track_id: String,
    adults_count: Number,
    transaction_id: String
});

module.exports = Bookings = mongoose.model('bookings', BookingSchema);