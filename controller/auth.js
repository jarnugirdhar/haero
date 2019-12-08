const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Authentication = require('../models/Authentication');
const uuid = require('uuid/v4');
const keys = require('../config/keys');

const register = (req, res) => {
    Authentication.findOne({email: req.body.email}).then(doc => {
        if(doc) {
            return res.status(422).json({
                message: "Account already exists",
                errors: {
                    already_exists: "Account already exists"
                },
                success: false
            })
        }
        else {
            let data = req.body;
            bcrypt.genSalt(10, (genSaltErr, salt) => {
                if(!genSaltErr) {
                    bcrypt.hash(data.password, salt, (hashErr, hashVal) => {
                        if(!hashErr) {
                            data.password = hashVal;
                            data.user_id = uuid();
                            const newUser = new Authentication(data);
                            newUser.save().then(resDoc => {
                                return res.status(201).json({
                                    message: "Account successfully created",
                                    errors: {},
                                    success: true
                                });
                            })
                        }
                        else {
                            return res.status(500).json({
                                message: "Internal server error",
                                errors: {
                                    internal: "Internal server error"
                                },
                                success: false
                            });
                        }
                    })
                }
                else {
                    return res.status(500).json({
                        message: "Internal server error",
                        errors: {
                            internal: "Internal server error"
                        },
                        success: false
                    });
                }
            })
        }
    }).catch(err => {
        return res.status(500).json({
            message: "Internal server error",
            errors: {
                internal: err
            },
            success: false
        });
    })
};

const login = (req, res) => {
    Authentication.findOne({email: req.body.email}).then(doc => {
        if(doc) {
            console.log(doc.user_id);
            bcrypt.compare(req.body.password, doc.password).then(result => {
                if(result) {
                    const jwtPayload = {
                        user_id: doc.user_id,
                        email: doc.email
                    };
                    jwt.sign(jwtPayload, keys.secretOrKey, {expiresIn: "2h"}, (err, token) => {
                        if(!err) {
                            return res.status(200).json({
                                token: token,
                                expiresIn: 2*60*60,
                                message: "Successfully logged in",
                                errors: {},
                                success: true
                            })
                        }
                        else {
                            return res.status(500).json({
                                message: "Internal server error",
                                errors: {
                                    jwt: err
                                },
                                success: false
                            })
                        }
                    })
                }
                else {
                    return res.status(401).json({
                        message: "Invalid password",
                        errors: {
                            invalid_pass: "Invalid password"
                        },
                        success: false
                    })
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).json({
                    message: "Internal server error",
                    errors: {
                        internal: err
                    },
                    success: false
                });
            })
        }
        else {
            return res.status(404).json({
                message: "User associated with this user id not found. Kindly register",
                errors: {
                    not_found: "bllaldjfsd"
                },
                success: false
            })
        }
    }).catch(err => {
        return res.status(500).json({
            message: "Internal server error",
            errors: {
                internal: err
            },
            success: false
        });
    })
};

module.exports = {
    loginController: login,
    registerController: register
};