const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema(
    {
        flightNumber: Number,
        mission: {
            type: String,
            required: true
        },
        rocket: {
            type: String,
            required: true
        },
        launchDate: {
            type: Date,
            required: true,
        },
        target: {
            type: String,
            required: true
        },
        customers: {
            type: [String],
            required: true
        },
        upcoming: {
            type: Boolean,
            required: true
        },
        success: {
            type: Boolean,
            required: true,
            default: true
        },
    }
);

// Connects the launchesSchema to the "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);