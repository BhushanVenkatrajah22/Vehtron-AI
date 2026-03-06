const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const demoDb = require('../utils/demoDb');

// @route   GET api/maintenance/upcoming
// @desc    Get all upcoming maintenance for user's vehicles
// @access  Private
router.get('/upcoming', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        return res.json(demoDb.maintenance.filter(m => !m.completed));
    }

    try {
        const vehicles = await Vehicle.find({ userId: req.user.id });
        const vehicleIds = vehicles.map(v => v._id);

        const upcoming = await Maintenance.find({
            vehicleId: { $in: vehicleIds },
            completed: false,
            $or: [
                { dueDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }, // Next 30 days
                { dueMileage: { $exists: true } } // Business logic for mileage comparison would happen here
            ]
        }).populate('vehicleId', ['make', 'model']);

        res.json(upcoming);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/maintenance/schedule
// @desc    Schedule maintenance
// @access  Private
router.post('/schedule', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        const newMaint = {
            ...req.body,
            _id: 'demo_maint_new_' + Date.now(),
            completed: false
        };

        // Find the vehicle to populate vehicleId for the frontend
        const vehicle = demoDb.vehicles.find(v => v._id === req.body.vehicleId);
        if (vehicle) {
            newMaint.vehicleId = { _id: vehicle._id, make: vehicle.make, model: vehicle.model };
        } else {
            newMaint.vehicleId = req.body.vehicleId; // fallback
        }

        demoDb.maintenance.unshift(newMaint);
        return res.json(newMaint);
    }

    try {
        const newSchedule = new Maintenance(req.body);
        const schedule = await newSchedule.save();
        res.json(schedule);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
