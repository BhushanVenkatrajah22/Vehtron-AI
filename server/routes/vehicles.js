const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');
const demoDb = require('../utils/demoDb');

// @route   GET api/vehicles
// @desc    Get all user vehicles
// @access  Private
router.get('/', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        return res.json(demoDb.vehicles);
    }

    try {
        const vehicles = await Vehicle.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        const vehicle = demoDb.vehicles.find(v => v._id === req.params.id);
        if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
        return res.json(vehicle);
    }

    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
        if (vehicle.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        res.json(vehicle);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Vehicle not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST api/vehicles
// @desc    Add a vehicle
// @access  Private
router.post('/', [auth, [
    check('make', 'Make is required').not().isEmpty(),
    check('model', 'Model is required').not().isEmpty(),
    check('year', 'Year is required').isNumeric(),
    check('licensePlate', 'License Plate is required').not().isEmpty(),
    check('currentMileage', 'Current Mileage is required').isNumeric()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (process.env.DEMO_MODE === 'true') {
        const newVehicle = {
            ...req.body,
            _id: 'demo_vehicle_new_' + Date.now(),
            userId: req.user.id,
            healthStatus: 'Excellent',
            batteryLevel: 100,
            lastMaintenance: new Date()
        };
        demoDb.vehicles.unshift(newVehicle); // Add to beginning
        return res.json(newVehicle);
    }

    try {
        const newVehicle = new Vehicle({
            ...req.body,
            userId: req.user.id
        });

        const vehicle = await newVehicle.save();
        res.json(vehicle);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/vehicles/:id
// @desc    Update a vehicle
// @access  Private
router.put('/:id', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        return res.json({
            ...req.body,
            _id: req.params.id,
            userId: req.user.id
        });
    }

    try {
        let vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
        if (vehicle.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(vehicle);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        demoDb.vehicles = demoDb.vehicles.filter(v => v._id !== req.params.id);
        return res.json({ msg: 'Vehicle removed' });
    }

    try {
        let vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
        if (vehicle.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Vehicle.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Vehicle removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
