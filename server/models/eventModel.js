const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import the UUID version 4

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventId: {
        type: String,
        default: uuidv4,
        unique: true,
        index: true
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
