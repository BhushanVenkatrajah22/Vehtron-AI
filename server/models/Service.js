const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceType: {
        type: String,
        required: true,
        enum: ['Oil Change', 'Tire Rotation', 'Brake Service', 'Battery Replacement', 'Filter Replacement', 'Fluid Check', 'General Inspection', 'Repairs']
    },
    date: { type: Date, default: Date.now },
    mileage: { type: Number, required: true },
    cost: { type: Number, required: true },
    notes: { type: String },
    serviceProvider: { type: String },
    receipt: { type: String }
});

module.exports = mongoose.model('Service', ServiceSchema);
