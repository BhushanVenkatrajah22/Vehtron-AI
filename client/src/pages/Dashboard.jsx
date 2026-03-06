import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Activity, Car, DollarSign, AlertTriangle, Zap, Battery, Cpu, Hexagon } from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardWrapper = styled.div`
  /* A premium abstract, dark sci-fi background image behind the dashboard */
  background-image: linear-gradient(to bottom, rgba(3, 5, 8, 0.4), rgba(3, 5, 8, 1)), url('https://images.unsplash.com/photo-1617469165786-8007eda3caa7?q=80&w=2940&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  margin: -2rem; /* Negate the AppContent padding to stretch background */
  padding: 2rem;
  min-height: calc(100vh - 70px);
  position: relative;
`;

const PageHeader = styled(motion.div)`
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .status-badge {
      font-size: 0.8rem;
      padding: 0.3rem 0.8rem;
      background: rgba(13, 240, 122, 0.1);
      border: 1px solid var(--accent-emerald);
      color: var(--accent-emerald);
      border-radius: 20px;
      font-family: 'Inter', monospace;
      letter-spacing: 1px;
      animation: pulse 2s infinite;
    }
  }

  p {
    color: var(--text-secondary);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(13, 240, 122, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(13, 240, 122, 0); }
    100% { box-shadow: 0 0 0 0 rgba(13, 240, 122, 0); }
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 4px solid ${props => props.color};
  padding: 1.8rem;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  transition: var(--transition-smooth);

  &::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background: radial-gradient(circle at top right, ${props => props.color}15, transparent 70%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px -10px ${props => props.color}40;
    border-color: rgba(255,255,255,0.1);
  }
`;

const IconWrapper = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  border-radius: 12px;
  color: ${props => props.color};
  box-shadow: inset 0 0 20px ${props => props.color}15;
  border: 1px solid rgba(255,255,255,0.05);
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const StatValue = styled.h2`
  font-size: 2.2rem;
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 20px rgba(255,255,255,0.2);
`;

const StatLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-family: 'Inter', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h3 {
      font-size: 1.2rem;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      svg { color: var(--accent-cyan); }
    }
  }
`;

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalVehicles: 0,
        totalServices: 0,
        totalCost: 0,
        upcomingMaintenance: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/dashboard/stats', {
                    headers: { 'x-auth-token': token }
                });
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

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

    // Chart Options
    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10, 14, 23, 0.9)',
                titleColor: '#fff',
                bodyColor: '#22d3ee',
                borderColor: 'rgba(34, 211, 238, 0.3)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8', font: { family: 'Inter' } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { family: 'Inter' } }
            }
        }
    };

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Telemetry Bandwidth (TB)',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: '#00f0ff',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
                return gradient;
            },
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#030508',
            pointBorderColor: '#00f0ff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const doughnutData = {
        labels: ['Electric', 'Hybrid', 'Combustion'],
        datasets: [{
            data: [45, 25, 30],
            backgroundColor: [
                'rgba(0, 240, 255, 0.8)',
                'rgba(157, 78, 221, 0.8)',
                'rgba(255, 0, 170, 0.8)'
            ],
            borderColor: '#030508',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    return (
        <DashboardWrapper>
            <PageHeader initial="hidden" animate="visible" variants={itemVariants}>
                <h1>
                    Central Command
                    <span className="status-badge">SYSTEMS ONLINE</span>
                </h1>
                <p>Real-time telemetry and fleet intelligence overview.</p>
            </PageHeader>

            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <DashboardGrid>
                    <StatCard color="var(--accent-cyan)" variants={itemVariants}>
                        <StatInfo>
                            <StatValue>{stats.totalVehicles}</StatValue>
                            <StatLabel>Active Nodes</StatLabel>
                        </StatInfo>
                        <IconWrapper color="var(--accent-cyan)">
                            <Car size={26} />
                        </IconWrapper>
                    </StatCard>

                    <StatCard color="var(--accent-purple)" variants={itemVariants}>
                        <StatInfo>
                            <StatValue>{stats.totalServices}</StatValue>
                            <StatLabel>Data Packets processED</StatLabel>
                        </StatInfo>
                        <IconWrapper color="var(--accent-purple)">
                            <Cpu size={26} />
                        </IconWrapper>
                    </StatCard>

                    <StatCard color="var(--accent-emerald)" variants={itemVariants}>
                        <StatInfo>
                            <StatValue>99.8%</StatValue>
                            <StatLabel>Network Efficiency</StatLabel>
                        </StatInfo>
                        <IconWrapper color="var(--accent-emerald)">
                            <Zap size={26} />
                        </IconWrapper>
                    </StatCard>

                    <StatCard color="var(--accent-magenta)" variants={itemVariants}>
                        <StatInfo>
                            <StatValue>{stats.upcomingMaintenance}</StatValue>
                            <StatLabel>Critical Anomalies</StatLabel>
                        </StatInfo>
                        <IconWrapper color="var(--accent-magenta)">
                            <AlertTriangle size={26} />
                        </IconWrapper>
                    </StatCard>
                </DashboardGrid>

                <ChartGrid>
                    <ChartBox variants={itemVariants}>
                        <div className="chart-header">
                            <h3><Activity size={20} /> Telemetry Stream Volume</h3>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Live Sync</button>
                        </div>
                        <div style={{ height: '320px', width: '100%' }}>
                            <Line data={lineData} options={chartOptions} />
                        </div>
                    </ChartBox>

                    <ChartBox variants={itemVariants}>
                        <div className="chart-header">
                            <h3><Battery size={20} /> Fleet Power Matrix</h3>
                        </div>
                        <div style={{ height: '320px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    maintainAspectRatio: false,
                                    cutout: '75%',
                                    plugins: {
                                        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter' }, padding: 20 } }
                                    }
                                }}
                            />
                        </div>
                    </ChartBox>
                </ChartGrid>
            </motion.div>
        </DashboardWrapper>
    )
}

export default Dashboard
