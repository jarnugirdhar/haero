const BookingsSchema = require('../models/Bookings');
const UserDetailSchema = require('../models/UserDetails');
const AuthenticationSchema = require('../models/Authentication');
let unirest = require("unirest");
const async = require('async');
const uuid = require('uuid/v4');

/*
    Input:
        Array: [ FlightId, OriginStation, DestinationStation, Departure, Arrival ]
        Update: [ PNR Generate, Invoice Number Generate, Luggage Tracking Id, Price, Transaction Id, airCash]
 */

const bookFlight = (req, res) => {
    const data = req.body.data.flight_details;
    const user_id = req.user.user_id;
    const pnr = uuid();
    const invoice_number = uuid();
    const luggage_track_id = uuid();
    const transaction_id = uuid();
    const booking_id = uuid();
    const updatedData = [];
    let price = req.body.price;
    let adults = req.body.adults_count;
    data.map((value, index) => {
        let updateCurrentDocument = {
            ...value,
            pnr,
            invoice_number,
            luggage_track_id,
            transaction_id,
            price,
            adults,
            user_id
        };
        updatedData.push(updateCurrentDocument);
    });
    BookingsSchema.insertMany(updatedData).then(doc => {
        let last_booking_id = booking_id;
        UserDetailSchema.findOneAndUpdate({user_id: user_id}, { $push: { previous_bookings: last_booking_id }, last_booking_id: last_booking_id }, {new: true, upsert: true})
            .then(resDoc => {
                res.status(201).json({
                    status: true,
                    message: "Successfully booked",
                    data: resDoc
                })
            }).catch(resErr => {
                res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    data: {}
                })
        })
    }).catch(err => {
        res.status(400).json({
            status: false,
            message: "Booking unsuccessful",
            data: {}
        })
    });
};
const flight_control = (req,res) => {
    if (req.body.hasOwnProperty('originPlace') && req.body.hasOwnProperty('destinationPlace')
        && req.body.hasOwnProperty('outboundDate') && req.body.hasOwnProperty('adults')){
        getSessionID(req.body['originPlace'], req.body['destinationPlace'],
            req.body['outboundDate'], req.body['adults'],
            function (err, data) {
                console.log(data);
                generateData(data,function (err,response) {
                    if(err){
                        return res.status(400).json({
                            status: false,
                            message: "Data not sent.",
                            data : {}
                        })
                    }
                    else {
                        return res.status(200).json({
                            status: true,
                            message: "Data sent.",
                            data: response
                        })
                    }
                })
            })
    }
    else{
        return res.status(400).json({
            status: false,
            message: "Data not sent.",
            data : {}
        })
    }
};

const getSessionID = (originPlace, destinationPlace, outboundDate, adults, callback) => {
    let req = unirest("POST", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0");

    req.headers({
        "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "x-rapidapi-key": "9b8d55f9bfmshb2c0b01982f0e81p1d2216jsn62ca8ddf3c86",
        "content-type": "application/x-www-form-urlencoded"
    });

    req.form({
        "country": "IN",
        "currency": "INR",
        "locale": "en-IN",
        "originPlace": originPlace,
        "destinationPlace": destinationPlace,
        "outboundDate": outboundDate,
        "adults": adults
    });


    req.end(function (res) {
        if (res.error){
            throw new Error(res.error)
        }
        else{
            let s = res.headers['location'];
            let start = s.lastIndexOf('/');
            let session = s.substring(start+1);
            //return session
            callback(null,session);
        }
    });
};

const generateData = (session,callback) => {
    let s = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/' + session;
    let req = unirest("GET", s);

    req.query({
        "pageIndex": "0",
        "pageSize": "10"
    });

    req.headers({
        "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "x-rapidapi-key": "9b8d55f9bfmshb2c0b01982f0e81p1d2216jsn62ca8ddf3c86"
    });


    req.end(function (res) {
        if (res.error){
            callback(res.error,null)
        }
        else{
            let data = res.body['Legs'];
            let seg = res.body['Segments'];
            let places = res.body['Places'];
            let idToName = {};
            async.eachSeries(places, function (p, ne) {
                idToName[p["Id"]] = p["Name"];
                ne()
            });

            let answer=[];
            async.eachSeries(data, function(value, next){
                let origin = value["OriginStation"];
                let destination = value["DestinationStation"];
                let arr = value["Arrival"];
                let dep = value["Departure"];
                let duration = value["Duration"];
                let carrier = value["Carriers"][0];
                let stops = value["Stops"];

                if(stops.length>0) {
                    //console.log(stops)
                    let temp1 = {
                        "Carrier": carrier,
                        "OriginStation": origin,
                        "DestinationStation": stops[0],
                        "DepartureDateTime": dep,
                        "ArrivalDateTime": '',
                        "DepartureName":'',
                        "ArrivalName":''
                    };

                    async.eachSeries(seg, function (segment, next2) {
                        if (segment["OriginStation"] === origin && segment["DestinationStation"] === stops[0]) {
                            temp1["ArrivalDateTime"] = segment["ArrivalDateTime"];
                            temp1["DepartureName"] = idToName[origin];
                            temp1["ArrivalName"] = idToName[stops[0]];
                            answer.push(temp1);
                            console.log(temp1);
                            origin = stops[0];
                        }
                        next2();
                    });
                    let count=0;
                    async.eachSeries(stops, function (val, next1) {
                        if(count===0){
                            count=1;
                            next1()
                        }
                        let destination = val;
                        let temp = {
                            "Carrier": carrier,
                            "OriginStation": origin,
                            "DestinationStation": destination,
                            "DepartureDateTime": '',
                            "ArrivalDateTime": '',
                            "DepartureName":'',
                            "ArrivalName":''
                        };
                        async.eachSeries(seg, function (segment, next2) {
                            if (segment["OriginStation"] === origin && segment["DestinationStation"] === destination) {
                                temp["ArrivalDateTime"] = segment["ArrivalDateTime"];
                                temp["DepartureDateTime"] = segment["DepartureDateTime"];
                                temp["DepartureName"] = idToName[origin];
                                temp["ArrivalName"] = idToName[destination];
                                answer.push(temp);
                                origin = segment["DestinationStation"]
                            }
                            next2();
                        });
                        next1()
                    });

                    let destination = value["DestinationStation"];
                    let temp = {
                        "Carrier": carrier,
                        "OriginStation": origin,
                        "DestinationStation": destination,
                        "DepartureDateTime": '',
                        "ArrivalDateTime": arr,
                        "DepartureName":'',
                        "ArrivalName":''
                    };
                    async.eachSeries(seg, function (segment, next3) {
                        if (segment["OriginStation"] === origin && segment["DestinationStation"] === destination) {
                            temp["DepartureDateTime"] = segment["DepartureDateTime"];
                            temp["DepartureName"] = idToName[origin];
                            temp["ArrivalName"] = idToName[destination];
                            answer.push(temp)
                        }
                        next3();
                    });
                }
                else{
                    let temp = {
                        "Carrier": carrier,
                        "OriginStation": origin,
                        "DestinationStation": destination,
                        "DepartureDateTime": dep,
                        "ArrivalDateTime": arr,
                        "DepartureName":'',
                        "ArrivalName":''
                    };
                    temp["DepartureName"] = idToName[origin];
                    temp["ArrivalName"] = idToName[destination];
                    answer.push(temp)
                }
                next();
            });
            callback(null,answer)
        }
    });
};


module.exports = {
    bookingController: bookFlight,
    searchFlightController: flight_control
};