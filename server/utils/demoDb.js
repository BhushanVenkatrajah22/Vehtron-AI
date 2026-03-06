const demoDb = {
    vehicles: [
        {
            _id: 'demo_vehicle_1',
            make: 'Cyberdyne Systems',
            model: 'T-800',
            year: 2029,
            licensePlate: 'SKY-NET',
            currentMileage: 12000,
            healthStatus: 'Excellent',
            batteryLevel: 98,
            lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
            _id: 'demo_vehicle_2',
            make: 'Tyrell Corp',
            model: 'Spinner',
            year: 2019,
            licensePlate: 'BR-2049',
            currentMileage: 45000,
            healthStatus: 'Good',
            batteryLevel: 75,
            lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        }
    ],
    services: [
        {
            _id: 'demo_service_1',
            vehicleId: 'demo_vehicle_1',
            serviceType: 'Oil Change',
            description: 'Regular synthetic oil change and filter replacement',
            mileage: 11000,
            cost: 89.99,
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
            _id: 'demo_service_2',
            vehicleId: 'demo_vehicle_2',
            serviceType: 'Tire Rotation',
            description: 'Rotated all 4 tires',
            mileage: 10000,
            cost: 45.00,
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        }
    ],
    maintenance: [
        {
            _id: 'demo_maint_1',
            vehicleId: { _id: 'demo_vehicle_1', make: 'Cyberdyne Systems', model: 'T-800' },
            taskName: 'Replace Brake Pads',
            description: 'Front brake pads are worn down to 3mm',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            priority: 'High',
            completed: false
        }
    ]
};

module.exports = demoDb;
