import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Bluetooth, RefreshCw, Zap, Thermometer, Gauge, Battery, Activity, Shield, AlertTriangle, CheckCircle, Database, Server } from 'lucide-react'

const ScanAnimation = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

const PulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(34, 211, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
`;

const PageContainer = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => props.active ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'var(--accent-cyan)' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'rgba(34, 211, 238, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ScannerCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  height: 500px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const ScanLine = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--accent-cyan);
  box-shadow: 0 0 20px 2px var(--accent-cyan);
  z-index: 10;
  animation: ${ScanAnimation} 2s ease-in-out infinite;
  top: 50%;
`;

const HexGrid = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10l12-10 12 10v20L12 40 0 30V10zm12-7.5l-9 7.5v15l9 7.5 9-7.5v-15l-9-7.5z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E");
`;

const Button = styled.button`
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  padding: 12px 32px;
  border-radius: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  z-index: 20;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
  }

  &.scanning {
    background: transparent;
    color: var(--accent-cyan);
    border: 1px solid var(--accent-cyan);
    animation: ${PulseAnimation} 2s infinite;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: var(--transition-smooth);
  
  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color || 'var(--accent-cyan)'};
    opacity: 0.5;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;

  svg {
    color: ${props => props.color || 'var(--text-secondary)'};
  }
`;

const MetricValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: baseline;
  gap: 0.25rem;

  span {
    font-size: 1rem;
    color: var(--text-muted);
    font-weight: 500;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;

  div {
    height: 100%;
    background: ${props => props.color || 'var(--accent-cyan)'};
    width: ${props => props.progress || '0'}%;
    transition: width 0.5s ease-out;
  }
`;

const AlertCard = styled.div`
  grid-column: 1 / -1;
  background: rgba(34, 211, 238, 0.05);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  h4 {
    color: var(--text-primary);
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
`;

const Diagnostics = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState({
        rpm: 0,
        speed: 0,
        temp: 0,
        voltage: 0,
        oilPressure: 0,
        engineLoad: 0,
        massAirFlow: 0,
        fuelLevel: 0
    });

    const startScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setIsConnected(true);
        }, 3500);
    };

    useEffect(() => {
        if (isConnected) {
            const interval = setInterval(() => {
                setData({
                    rpm: Math.floor(1800 + Math.random() * 200),
                    speed: Math.floor(65 + Math.random() * 5),
                    temp: 88 + Math.floor(Math.random() * 3),
                    voltage: (13.8 + Math.random() * 0.2).toFixed(1),
                    oilPressure: 42 + Math.floor(Math.random() * 5),
                    engineLoad: 35 + Math.floor(Math.random() * 10),
                    massAirFlow: (12.4 + Math.random()).toFixed(1),
                    fuelLevel: 78
                });
            }, 800);
            return () => clearInterval(interval);
        }
    }, [isConnected]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <PageContainer initial="hidden" animate="visible" variants={containerVariants}>
            <Header>
                <div>
                    <h1>System Diagnostics</h1>
                    <p>Real-time OBD-II telemetry and system analysis</p>
                </div>
                <StatusBadge active={isConnected || isScanning}>
                    {isConnected ? <CheckCircle size={16} /> : isScanning ? <RefreshCw className="spin" size={16} /> : <Database size={16} />}
                    {isConnected ? 'LIVE CONNECTION' : isScanning ? 'ESTABLISHING LINK...' : 'DISCONNECTED'}
                </StatusBadge>
            </Header>

            <DashboardGrid>
                <ScannerCard>
                    <HexGrid />
                    {isScanning && <ScanLine />}

                    <AnimatePresence mode="wait">
                        {!isConnected && !isScanning && (
                            <motion.div
                                key="disconnected"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                style={{ textAlign: 'center', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <Bluetooth size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Awaiting Connection</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '200px' }}>Connect to vehicle OBD-II port to stream live telemetry.</p>
                                <Button onClick={startScan}>
                                    Initialize Link
                                </Button>
                            </motion.div>
                        )}

                        {isScanning && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ textAlign: 'center', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <Server className="spin" size={48} color="var(--accent-cyan)" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Handshaking...</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Negotiating protocol ISO 15765-4</p>
                                <Button className="scanning">
                                    Abort Sequence
                                </Button>
                            </motion.div>
                        )}

                        {isConnected && (
                            <motion.div
                                key="connected"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ width: '100%', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 20 }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                                        <Activity size={20} />
                                        <span style={{ fontWeight: '600', letterSpacing: '1px' }}>LINK ESTABLISHED</span>
                                    </div>
                                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>VIN READ</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px', marginTop: '0.5rem' }}>
                                        1HGCM82633A004XXX
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Protocol</span>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.9rem' }}>CAN 11/500</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ECU Latency</span>
                                        <span style={{ color: 'var(--accent-cyan)', fontWeight: '500', fontSize: '0.9rem' }}>12ms</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Data Rate</span>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.9rem' }}>42 PIDs/sec</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ScannerCard>

                <MetricsGrid>
                    <MetricCard variants={itemVariants} color="#3b82f6">
                        <MetricHeader color="#3b82f6"><Gauge size={18} /> Engine Speed</MetricHeader>
                        <MetricValue>{isConnected ? data.rpm : '--'} <span>RPM</span></MetricValue>
                        <ProgressBar color="#3b82f6" progress={isConnected ? (data.rpm / 8000) * 100 : 0} />
                    </MetricCard>

                    <MetricCard variants={itemVariants} color="#10b981">
                        <MetricHeader color="#10b981"><Zap size={18} /> Vehicle Speed</MetricHeader>
                        <MetricValue>{isConnected ? data.speed : '--'} <span>KM/H</span></MetricValue>
                        <ProgressBar color="#10b981" progress={isConnected ? (data.speed / 220) * 100 : 0} />
                    </MetricCard>

                    <MetricCard variants={itemVariants} color="#f59e0b">
                        <MetricHeader color="#f59e0b"><Thermometer size={18} /> Coolant Temp</MetricHeader>
                        <MetricValue>{isConnected ? data.temp : '--'} <span>°C</span></MetricValue>
                        <ProgressBar color="#f59e0b" progress={isConnected ? (data.temp / 120) * 100 : 0} />
                    </MetricCard>

                    <MetricCard variants={itemVariants} color="#8b5cf6">
                        <MetricHeader color="#8b5cf6"><Battery size={18} /> Battery Voltage</MetricHeader>
                        <MetricValue>{isConnected ? data.voltage : '--'} <span>V</span></MetricValue>
                        <ProgressBar color="#8b5cf6" progress={isConnected ? (data.voltage / 16) * 100 : 0} />
                    </MetricCard>

                    <MetricCard variants={itemVariants} color="#ec4899">
                        <MetricHeader color="#ec4899"><Activity size={18} /> Engine Load</MetricHeader>
                        <MetricValue>{isConnected ? data.engineLoad : '--'} <span>%</span></MetricValue>
                        <ProgressBar color="#ec4899" progress={isConnected ? data.engineLoad : 0} />
                    </MetricCard>

                    <MetricCard variants={itemVariants} color="#06b6d4">
                        <MetricHeader color="#06b6d4"><Database size={18} /> Mass Air Flow</MetricHeader>
                        <MetricValue>{isConnected ? data.massAirFlow : '--'} <span>g/s</span></MetricValue>
                        <ProgressBar color="#06b6d4" progress={isConnected ? (data.massAirFlow / 50) * 100 : 0} />
                    </MetricCard>

                    <AlertCard as={motion.div} variants={itemVariants}>
                        <Shield size={24} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h4>System Status Nominal</h4>
                            <p>No Diagnostic Trouble Codes (DTC) detected in the ECU. All emissions monitors are complete and passing.</p>
                        </div>
                    </AlertCard>
                </MetricsGrid>
            </DashboardGrid>
        </PageContainer>
    )
}

export default Diagnostics
