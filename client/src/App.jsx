import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Vehicles from './pages/Vehicles'
import VehicleDetails from './pages/VehicleDetails'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import styled from 'styled-components'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1a1a2e, #0a0a0f);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: 260px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

import Maintenance from './pages/Maintenance'
import Diagnostics from './pages/Diagnostics'
import Settings from './pages/Settings'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AppContainer>
            {isAuthenticated && <Sidebar />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                <MainContent>
                    <Routes>
                        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
                        <Route path="/register" element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
                        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/vehicles" element={isAuthenticated ? <Vehicles /> : <Navigate to="/login" />} />
                        <Route path="/vehicles/:id" element={isAuthenticated ? <VehicleDetails /> : <Navigate to="/login" />} />
                        <Route path="/maintenance" element={isAuthenticated ? <Maintenance /> : <Navigate to="/login" />} />
                        <Route path="/diagnostics" element={isAuthenticated ? <Diagnostics /> : <Navigate to="/login" />} />
                        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
                    </Routes>
                </MainContent>
            </div>
        </AppContainer>
    )
}

export default App
