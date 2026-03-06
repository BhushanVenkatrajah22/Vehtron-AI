const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Service = require('../models/Service');
const Vehicle = require('../models/Vehicle');
const demoDb = require('../utils/demoDb');

// @route   GET api/services/:vehicleId
// @desc    Get all services for a vehicle
// @access  Private
router.get('/:vehicleId', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        return res.json(demoDb.services.filter(s => s.vehicleId === req.params.vehicleId));
    }

    try {
        const services = await Service.find({ vehicleId: req.params.vehicleId }).sort({ date: -1 });
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/services
// @desc    Add a service record
// @access  Private
router.post('/', [auth, [
    check('vehicleId', 'Vehicle ID is required').not().isEmpty(),
    check('serviceType', 'Service Type is required').not().isEmpty(),
    check('mileage', 'Mileage is required').isNumeric(),
    check('cost', 'Cost is required').isNumeric()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (process.env.DEMO_MODE === 'true') {
        const newService = {
            ...req.body,
            _id: 'demo_service_new_' + Date.now(),
            date: new Date()
        };
        demoDb.services.unshift(newService);
        return res.json(newService);
    }

    try {
        const vehicle = await Vehicle.findById(req.body.vehicleId);
        if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
        if (vehicle.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const newService = new Service(req.body);
        const service = await newService.save();

        // Update vehicle mileage if service mileage is higher
        if (req.body.mileage > vehicle.currentMileage) {
            vehicle.currentMileage = req.body.mileage;
            await vehicle.save();
        }

        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
