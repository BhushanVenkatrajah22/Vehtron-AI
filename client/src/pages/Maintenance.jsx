import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AlertBanner = styled.div`
  background: rgba(255, 187, 0, 0.1);
  border: 1px solid #ffbb00;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #ffbb00;
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ScheduleCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
`;

const Maintenance = () => {
    const [upcoming, setUpcoming] = useState([]);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/maintenance/upcoming', {
                    headers: { 'x-auth-token': token }
                });
                setUpcoming(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUpcoming();
    }, []);

    return (
        <PageContainer>
            <h1>MAINTENANCE INTELLIGENCE</h1>

            {upcoming.length > 0 ? (
                <AlertBanner>
                    <AlertTriangle size={32} />
                    <div>
                        <h3 className="orbitron">ACTION REQUIRED</h3>
                        <p>System detected {upcoming.length} upcoming service requirements for your fleet.</p>
                    </div>
                </AlertBanner>
            ) : (
                <AlertBanner style={{ background: 'rgba(0, 240, 255, 0.05)', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                    <CheckCircle size={32} />
                    <div>
                        <h3 className="orbitron">ALL SYSTEMS OPTIMAL</h3>
                        <p>No immediate maintenance actions required for your current odometer readings.</p>
                    </div>
                </AlertBanner>
            )}

            <ScheduleGrid>
                {upcoming.map(item => (
                    <ScheduleCard key={item._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'var(--accent-cyan)' }} className="orbitron">{item.serviceType}</h3>
                            <Clock size={20} color="var(--text-secondary)" />
                        </div>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Vehicle: <span style={{ color: 'white' }}>{item.vehicleId.make} {item.vehicleId.model}</span>
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '5px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>DUE DATE</span>
                                <div style={{ fontSize: '0.9rem' }}>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}</div>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '5px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>DUE MILEAGE</span>
                                <div style={{ fontSize: '0.9rem' }}>{item.dueMileage} KM</div>
                            </div>
                        </div>
                    </ScheduleCard>
                ))}
            </ScheduleGrid>

            <section style={{ marginTop: '2rem' }}>
                <h2 className="orbitron" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>RECURRING RULES</h2>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Rules configured based on manufacturer guidelines:</p>
                    <ul style={{ marginTop: '1rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: 6, height: 6, background: 'var(--accent-cyan)', borderRadius: '50%' }}></div> Oil Change - Every 5,000 KM or 6 Months</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: 6, height: 6, background: 'var(--accent-cyan)', borderRadius: '50%' }}></div> Tire Rotation - Every 10,000 KM</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: 6, height: 6, background: 'var(--accent-cyan)', borderRadius: '50%' }}></div> Brake Inspection - Every 12 Months</li>
                    </ul>
                </div>
            </section>
        </PageContainer>
    )
}

export default Maintenance
