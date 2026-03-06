const mongoose = require('mongoose');

const MaintenanceScheduleSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceType: { type: String, required: true },
    dueDate: { type: Date },
    dueMileage: { type: Number },
    recurring: { type: Boolean, default: false },
    intervalMiles: { type: Number },
    intervalMonths: { type: Number },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('MaintenanceSchedule', MaintenanceScheduleSchema);
