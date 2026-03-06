import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Car, Trash2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const VehicleCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
  }
`;

const VehicleImage = styled.div`
  height: 180px;
  background: linear-gradient(45deg, #12121a, #1a1a2e);
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.1);
`;

const VehicleInfo = styled.div`
  padding: 1.5rem;
`;

const Badge = styled.span`
  background: rgba(0, 240, 255, 0.1);
  color: var(--accent-cyan);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const AddButton = styled.button`
  background: var(--accent-cyan);
  color: var(--bg-primary);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 0 15px var(--accent-cyan);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--bg-secondary);
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--accent-cyan);
`;

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        make: '', model: '', year: '', licensePlate: '', currentMileage: ''
    });

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/vehicles', {
                headers: { 'x-auth-token': token }
            });
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/vehicles', formData, {
                headers: { 'x-auth-token': token }
            });
            setIsModalOpen(false);
            fetchVehicles();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this vehicle?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/vehicles/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                fetchVehicles();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <PageHeader>
                <h1>GARAGE ARCHIVE</h1>
                <AddButton onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> ADD VEHICLE
                </AddButton>
            </PageHeader>

            <VehicleGrid>
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle._id} whileHover={{ y: -5 }}>
                        <VehicleImage>
                            <Car size={64} />
                        </VehicleImage>
                        <VehicleInfo>
                            <Badge>{vehicle.year}</Badge>
                            <h3 style={{ marginBottom: '5px' }}>{vehicle.make} {vehicle.model}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                                {vehicle.licensePlate} | {vehicle.currentMileage} KM
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to={`/vehicles/${vehicle._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                    <AddButton style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}>
                                        <ExternalLink size={16} /> VIEW DATA
                                    </AddButton>
                                </Link>
                                <button
                                    onClick={() => handleDelete(vehicle._id)}
                                    style={{ background: 'rgba(255, 0, 170, 0.1)', color: 'var(--accent-magenta)', border: '1px solid var(--accent-magenta)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </VehicleInfo>
                    </VehicleCard>
                ))}
            </VehicleGrid>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <ModalContent>
                            <h2>INITIALIZE VEHICLE</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                <input
                                    className="glass-input"
                                    placeholder="MAKE"
                                    required
                                    value={formData.make}
                                    onChange={e => setFormData({ ...formData, make: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: 'white' }}
                                />
                                <input
                                    placeholder="MODEL"
                                    required
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: 'white' }}
                                />
                                <input
                                    placeholder="YEAR"
                                    required
                                    type="number"
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: 'white' }}
                                />
                                <input
                                    placeholder="LICENSE PLATE"
                                    required
                                    value={formData.licensePlate}
                                    onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: 'white' }}
                                />
                                <input
                                    placeholder="CURRENT MILEAGE"
                                    required
                                    type="number"
                                    value={formData.currentMileage}
                                    onChange={e => setFormData({ ...formData, currentMileage: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: 'white' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <AddButton type="submit" style={{ flex: 1 }}>INITIALIZE</AddButton>
                                    <AddButton type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', color: 'white', border: '1px solid white' }}>CANCEL</AddButton>
                                </div>
                            </form>
                        </ModalContent>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Vehicles
