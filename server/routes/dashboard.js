const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');
const Maintenance = require('../models/Maintenance');
const demoDb = require('../utils/demoDb');

// @route   GET api/dashboard/stats
// @desc    Get counts and totals for dashboard
// @access  Private
router.get('/stats', auth, async (req, res) => {
    if (process.env.DEMO_MODE === 'true') {
        const totalVehicles = demoDb.vehicles.length;
        const totalServices = demoDb.services.length;
        const totalCost = demoDb.services.reduce((acc, curr) => acc + curr.cost, 0);
        const upcomingMaintenance = demoDb.maintenance.filter(m => !m.completed).length;

        return res.json({
            totalVehicles,
            totalServices,
            totalCost,
            upcomingMaintenance
        });
    }

    try {
        const vehicles = await Vehicle.find({ userId: req.user.id });
        const vehicleIds = vehicles.map(v => v._id);

        const totalVehicles = vehicles.length;
        const services = await Service.find({ vehicleId: { $in: vehicleIds } });
        const totalServices = services.length;
        const totalCost = services.reduce((acc, curr) => acc + curr.cost, 0);

        // Placeholder for maintenance alerts
        const upcoming = await Maintenance.countDocuments({ vehicleId: { $in: vehicleIds }, completed: false });

        res.json({
            totalVehicles,
            totalServices,
            totalCost,
            upcomingMaintenance: upcoming
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
