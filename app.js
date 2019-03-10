const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
app = express();

//Configuring server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {

    if(!req.query.location) {
        res.json({
            success: false,
            data: "'location' required"
        })
    }

    try {
        let maxDistance = req.query.maxDistance || 500;
        maxDistance = parseInt(maxDistance);
        
        let location = req.query.location;
        let [ lat, lon ] = location.split(',');
        [ lat, lon ] = [ parseFloat(lat), parseFloat(lon) ];

        let result = await db.Road.aggregate([
            {
                "$geoNear": {
                        "near": {
                                "type": "Point",
                                "coordinates": [ lon, lat ]
                        },
                        "maxDistance": maxDistance,
                        "spherical": true,
                        "distanceField": "distance",
                }
            },
            {
                "$project": {
                    "distance": 1,
                    "properties.name": 1,
                    "properties.description": 1,
                }
            }
        ]);

        res.json({
            success: true,
            data: result
        });

    } catch(err) {
        res.json({
            success: false,
            data: err.message
        })
    }
});


module.exports = app;