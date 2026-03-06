import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Car, Trash2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const PageWrapper = styled(motion.div)`
  padding: 1rem 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.2rem;
    color: var(--text-primary);
  }
`;

const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const VehicleCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: var(--transition-smooth);

  &:hover {
    border-color: var(--glass-border-highlight);
    box-shadow: 0 10px 30px rgba(0, 240, 255, 0.1);
    transform: translateY(-4px);
  }
`;

const VehicleImage = styled.div`
  height: 160px;
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(157, 78, 221, 0.05));
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
`;

const VehicleInfo = styled.div`
  padding: 1.5rem;
`;

const Badge = styled.span`
  background: rgba(0, 240, 255, 0.1);
  color: var(--accent-cyan);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: 'Inter', monospace;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: inline-block;
  letter-spacing: 1px;
`;

const AddButton = styled.button`
  background: var(--accent-cyan);
  color: var(--bg-primary);
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: var(--transition-smooth);
  
  &:hover {
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
    transform: translateY(-2px);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(3, 5, 8, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--glass-bg);
  width: 90%;
  max-width: 500px;
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid var(--accent-cyan);
  box-shadow: var(--glow-cyan);
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
  }
`;

const InputGroup = styled.input`
  width: 100%;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 14px;
  color: white;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  transition: var(--transition-smooth);
  
  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: inset 0 0 10px rgba(0,240,255,0.1);
  }
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PageWrapper initial="hidden" animate="visible" variants={containerVariants}>
            <PageHeader variants={itemVariants}>
                <h1>FLEET MATRIX</h1>
                <AddButton onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> INITIALIZE VEHICLE
                </AddButton>
            </PageHeader>

            <VehicleGrid>
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle._id} variants={itemVariants}>
                        <VehicleImage>
                            <Car size={48} />
                        </VehicleImage>
                        <VehicleInfo>
                            <Badge>UNIT {vehicle.year}</Badge>
                            <h3 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>{vehicle.make} {vehicle.model}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', gap: '10px' }}>
                                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{vehicle.licensePlate}</span>
                                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{vehicle.currentMileage} KM</span>
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to={`/vehicles/${vehicle._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                    <AddButton style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}>
                                        <ExternalLink size={18} /> ACCESS TELEMETRY
                                    </AddButton>
                                </Link>
                                <button
                                    onClick={() => handleDelete(vehicle._id)}
                                    style={{ background: 'transparent', color: 'var(--accent-magenta)', border: '1px solid var(--accent-magenta)', padding: '0 15px', borderRadius: '10px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 0, 170, 0.1)' }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
                                    title="Decommission Node"
                                >
                                    <Trash2 size={18} />
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
                            <h2>INITIALIZE NODE</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
                                <InputGroup
                                    placeholder="MANUFACTURER (MAKE)"
                                    required
                                    value={formData.make}
                                    onChange={e => setFormData({ ...formData, make: e.target.value })}
                                />
                                <InputGroup
                                    placeholder="DESIGNATION (MODEL)"
                                    required
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                />
                                <InputGroup
                                    placeholder="CLASSIFICATION YEAR"
                                    required
                                    type="number"
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                                />
                                <InputGroup
                                    placeholder="IDENTIFIER (LICENSE PLATE)"
                                    required
                                    value={formData.licensePlate}
                                    onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                                />
                                <InputGroup
                                    placeholder="CURRENT LIFESPAN (MILEAGE)"
                                    required
                                    type="number"
                                    value={formData.currentMileage}
                                    onChange={e => setFormData({ ...formData, currentMileage: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <AddButton type="submit" style={{ flex: 1, justifyContent: 'center' }}>ENGAGE</AddButton>
                                    <AddButton type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, justifyContent: 'center', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>ABORT</AddButton>
                                </div>
                            </form>
                        </ModalContent>
                    </Modal>
                )}
            </AnimatePresence>
        </PageWrapper>
    )
}

export default Vehicles
