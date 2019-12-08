const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Authentication = mongoose.model('authentication');
const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Authentication.findOne({user_id: jwt_payload.user_id}).then(doc => {
            if(doc) {
                return done(null, doc);
            }
            return done(null, false);
        }).catch(err => {
            const jwtError = {
                token: 'Unauthorized route access',
                error: err
            };
            return done(jwtError, false);
        })
    }))
};