import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, Gauge } from 'lucide-react'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const VehicleDetailCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(0, 240, 255, 0.2);
  height: fit-content;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const TimelineItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  padding: 1.5rem;
  border-radius: 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -26px;
    top: 20px;
    width: 12px;
    height: 12px;
    background: var(--accent-cyan);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--accent-cyan);
  }
`;

const VehicleDetails = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const vRes = await axios.get(`/api/vehicles/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                const sRes = await axios.get(`/api/services/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setVehicle(vRes.data);
                setServices(sRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    if (!vehicle) return <div>Loading Data Stream...</div>;

    return (
        <Container>
            <VehicleDetailCard>
                <h2 className="orbitron" style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>VEHICLE SPEC</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>MANUFACTURER</span>
                        <span>{vehicle.make}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>MODEL</span>
                        <span>{vehicle.model}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>YEAR</span>
                        <span>{vehicle.year}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>LICENSE</span>
                        <span>{vehicle.licensePlate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>CURRENT ODOMETER</span>
                        <span className="orbitron">{vehicle.currentMileage} KM</span>
                    </div>
                </div>
            </VehicleDetailCard>

            <div>
                <h2 className="orbitron" style={{ marginBottom: '1.5rem' }}>MAINTENANCE TIMELINE</h2>
                <Timeline>
                    {services.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No service records in archive.</p>
                    ) : (
                        services.map((service, index) => (
                            <TimelineItem
                                key={service._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h4 style={{ color: 'var(--accent-cyan)' }}>{service.serviceType}</h4>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(service.date).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{service.notes || 'Routine maintenance operation.'}</p>
                                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Gauge size={14} /> {service.mileage} KM</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {service.serviceProvider || 'VEHTRON CENTER'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-magenta)' }}>CP: ${service.cost}</span>
                                </div>
                            </TimelineItem>
                        ))
                    )}
                </Timeline>
            </div>
        </Container>
    )
}

export default VehicleDetails
