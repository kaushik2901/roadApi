const mongoose = require('mongoose');

const roadSchema = mongoose.Schema({
    type: { type: String },
    geometry: {
        type: {
            type: String
        },
        coordinates: [ Array ]
    },
    properties: {
        name : { type: String },
        description : { type: String }
    }
}, { timestamps: true } );

roadSchema.index({ geometry: '2dsphere' });
module.exports = {
    Road: mongoose.model('Road', roadSchema),
    roadSchema: roadSchema
}