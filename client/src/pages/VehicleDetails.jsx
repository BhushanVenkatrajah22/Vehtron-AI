import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Gauge, ChevronLeft, Wrench, AlertCircle, BatteryCharging, ShieldCheck, Activity } from 'lucide-react'

const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 4rem;
`;

const HeaderNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  a {
    color: var(--text-secondary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: var(--transition-smooth);
    
    &:hover {
      color: var(--accent-cyan);
    }
  }
`;

const VehicleHeader = styled.div`
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: var(--accent-cyan);
    box-shadow: var(--glow-cyan);
  }
`;

const TitleBlock = styled.div`
  h1 {
    font-size: 3.5rem;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.1;
  }
  
  p {
    font-size: 1.25rem;
    color: var(--accent-cyan);
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: 2px;
    margin-top: 0.5rem;
  }
`;

const VinBadge = styled.div`
  background: rgba(0,0,0,0.4);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  font-family: 'Inter', monospace;
  font-size: 0.85rem;
  letter-spacing: 3px;
  color: var(--text-secondary);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled(motion.div)`
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: var(--transition-smooth);

  &:hover {
    border-color: rgba(34, 211, 238, 0.3);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-secondary);
    font-size: 0.95rem;

    svg {
      color: var(--accent-cyan);
    }
  }

  .value {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const TimelineContainer = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    svg {
      color: var(--accent-purple);
    }
  }
`;

const Timeline = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 10px;
    bottom: 10px;
    width: 2px;
    background: linear-gradient(to bottom, var(--accent-cyan), var(--accent-purple), transparent);
    opacity: 0.3;
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  padding-left: 3.5rem;
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  .node {
    position: absolute;
    left: 11px;
    top: 6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--bg-primary);
    border: 3px solid var(--accent-cyan);
    box-shadow: var(--glow-cyan);
    z-index: 2;
  }

  .content {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 1.5rem;
    transition: var(--transition-smooth);

    &:hover {
      background: rgba(255,255,255,0.05);
      transform: translateX(5px);
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;

    h4 {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin: 0;
    }

    .date {
      font-size: 0.85rem;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.05);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
    }
  }

  .desc {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.25rem;
  }

  .meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);

    span {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .cost {
      color: var(--accent-magenta);
      font-weight: 500;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--glass-bg);
  border: 1px dashed var(--glass-border);
  border-radius: 16px;
  color: var(--text-muted);

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const VehicleDetails = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const pageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--accent-cyan)' }}>
                <Activity className="spin" size={32} />
                <span style={{ marginLeft: '1rem', fontFamily: 'Space Grotesk', fontWeight: '500' }}>Decrypting Vehicle Data...</span>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                <h2>Vehicle Not Found</h2>
                <Link to="/vehicles" style={{ color: 'var(--accent-cyan)' }}>Return to Fleet</Link>
            </div>
        );
    }

    return (
        <PageContainer initial="hidden" animate="visible" variants={pageVariants}>
            <HeaderNav>
                <Link to="/vehicles"><ChevronLeft size={18} /> BACK TO FLEET</Link>
            </HeaderNav>

            <VehicleHeader>
                <TitleBlock>
                    <h1>{vehicle.make} {vehicle.model}</h1>
                    <p>{vehicle.year} EDITION</p>
                </TitleBlock>
                <VinBadge>
                    VIN: {vehicle._id.includes('demo') ? 'VEHTRON-DEMO-' + vehicle.year : vehicle._id.substring(0, 12).toUpperCase()}
                </VinBadge>
            </VehicleHeader>

            <ContentGrid>
                <StatsCard variants={pageVariants}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>System Overview</h3>
                    <StatItem>
                        <div className="label"><Gauge size={18} /> Odometer</div>
                        <div className="value">{vehicle.currentMileage.toLocaleString()} KM</div>
                    </StatItem>
                    <StatItem>
                        <div className="label"><AlertCircle size={18} /> License Plate</div>
                        <div className="value">{vehicle.licensePlate}</div>
                    </StatItem>
                    <StatItem>
                        <div className="label"><ShieldCheck size={18} /> Health Status</div>
                        <div className="value" style={{ color: 'var(--accent-cyan)' }}>{vehicle.healthStatus || 'OPTIMAL'}</div>
                    </StatItem>
                    <StatItem>
                        <div className="label"><BatteryCharging size={18} /> Energy Level</div>
                        <div className="value">{vehicle.batteryLevel || 100}%</div>
                    </StatItem>
                </StatsCard>

                <TimelineContainer>
                    <motion.h3 variants={pageVariants}><Wrench size={24} /> Service History log</motion.h3>

                    {services.length === 0 ? (
                        <EmptyState>
                            <Calendar size={48} />
                            <p>No service records found in the archive.</p>
                        </EmptyState>
                    ) : (
                        <Timeline>
                            <AnimatePresence>
                                {services.map((service, index) => (
                                    <TimelineItem
                                        key={service._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.15 + 0.3 }}
                                    >
                                        <div className="node" />
                                        <div className="content">
                                            <div className="header">
                                                <h4>{service.serviceType}</h4>
                                                <div className="date">{new Date(service.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                            </div>
                                            <div className="desc">
                                                {service.description || service.notes || 'Routine diagnostic and maintenance operation performed by authorized Vehtron systems.'}
                                            </div>
                                            <div className="meta">
                                                <span><Gauge size={16} /> {service.mileage.toLocaleString()} KM</span>
                                                <span className="cost">COST: ${service.cost.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </TimelineItem>
                                ))}
                            </AnimatePresence>
                        </Timeline>
                    )}
                </TimelineContainer>
            </ContentGrid>
        </PageContainer>
    )
}

export default VehicleDetails
