const express = require('express');
const userController = require('../controller/user');
const passport = require('passport');
const router = express.Router();

router.post('/book_flight', passport.authenticate('jwt', {session: false}), userController.bookingController);
router.post('/search_flight', passport.authenticate('jwt', {session: false}), userController.searchFlightController);

module.exports = router;
