import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Activity, Car, DollarSign, AlertTriangle } from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
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
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => props.color || 'var(--accent-cyan)'};
    box-shadow: 0 0 10px ${props => props.color || 'var(--accent-cyan)'};
  }
`;

const IconWrapper = styled.div`
  background: ${props => props.bg || 'rgba(0, 240, 255, 0.1)'};
  padding: 12px;
  border-radius: 10px;
  color: ${props => props.color || 'var(--accent-cyan)'};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.h2`
  font-size: 1.8rem;
  font-family: 'Orbitron', sans-serif;
`;

const StatLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
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

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Maintenance Spending',
                data: [1200, 1900, 300, 500, 2000, 3000],
                borderColor: '#00f0ff',
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>SYSTEM STATUS OVERVIEW</h1>

            <DashboardGrid>
                <StatCard color="var(--accent-cyan)">
                    <IconWrapper color="var(--accent-cyan)" bg="rgba(0, 240, 255, 0.1)">
                        <Car size={24} />
                    </IconWrapper>
                    <StatInfo>
                        <StatValue>{stats.totalVehicles}</StatValue>
                        <StatLabel>Total Vehicles</StatLabel>
                    </StatInfo>
                </StatCard>

                <StatCard color="var(--accent-purple)">
                    <IconWrapper color="var(--accent-purple)" bg="rgba(123, 44, 255, 0.1)">
                        <Activity size={24} />
                    </IconWrapper>
                    <StatInfo>
                        <StatValue>{stats.totalServices}</StatValue>
                        <StatLabel>Service Operations</StatLabel>
                    </StatInfo>
                </StatCard>

                <StatCard color="var(--accent-magenta)">
                    <IconWrapper color="var(--accent-magenta)" bg="rgba(255, 0, 170, 0.1)">
                        <DollarSign size={24} />
                    </IconWrapper>
                    <StatInfo>
                        <StatValue>${stats.totalCost}</StatValue>
                        <StatLabel>Total Expenditure</StatLabel>
                    </StatInfo>
                </StatCard>

                <StatCard color="#ffbb00">
                    <IconWrapper color="#ffbb00" bg="rgba(255, 187, 0, 0.1)">
                        <AlertTriangle size={24} />
                    </IconWrapper>
                    <StatInfo>
                        <StatValue>{stats.upcomingMaintenance}</StatValue>
                        <StatLabel>Pending Alerts</StatLabel>
                    </StatInfo>
                </StatCard>
            </DashboardGrid>

            <ChartContainer>
                <ChartBox>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>ANNUAL MAINTENANCE ANALYSIS</h3>
                    <div style={{ height: '300px' }}>
                        <Line data={lineData} options={{ maintainAspectRatio: false }} />
                    </div>
                </ChartBox>
                <ChartBox>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>FLEET DISTRIBUTION</h3>
                    <div style={{ height: '300px' }}>
                        <Bar
                            data={{
                                labels: ['Tesla', 'BMW', 'Audi'],
                                datasets: [{
                                    label: 'Vehicles',
                                    data: [12, 19, 3],
                                    backgroundColor: ['#00f0ff', '#7b2cff', '#ff00aa']
                                }]
                            }}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                </ChartBox>
            </ChartContainer>
        </div>
    )
}

export default Dashboard
