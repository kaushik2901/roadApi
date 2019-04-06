const mongoose = require('mongoose');
const fs = require('fs');
const xmlDom = require('xmldom');
const formidable = require('formidable');
const tj = require('@mapbox/togeojson');
const db = require('./db');

module.exports.home = async (req, res) => {

    if(!req.query.location) {
        res.json({
            success: false,
            data: "'location' required"
        })
    }

    try {        
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
                        "spherical": true,
                        "distanceField": "distance",
                        "distanceMultiplier" : 0.001,
                }
            },
            {
                "$project": {
                    "distance": 1,
                    "properties.name": 1,
                    "properties.description": 1,
                }
            }
        ]).limit(2);

        result = result.map(item => {
            return {
                uniqe_code: item.properties.name,
                name: item.properties.description,
                distance: item.distance,
            }
        })

        res.json(result);

    } catch(err) {
        res.json({
            success: false,
            data: err.message
        })
    }
}

module.exports.addRoad = async (req, res) => {
    let filePath;
    let form = new formidable.IncomingForm({
        uploadDir: __dirname,
        keepExtensions: true
    });

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = filePath = __dirname + "/" + file.name;
    });

    form.on('file', function (name, file){
        let kml = fs.readFileSync(file.path);
        kml = String(kml);
        let geoJson = tj.kml((new xmlDom.DOMParser()).parseFromString(kml, 'text/kml'));
        console.log(geoJson);
        res.json({
            success:true
        });
        fs.unlinkSync(filePath);
    });
}
