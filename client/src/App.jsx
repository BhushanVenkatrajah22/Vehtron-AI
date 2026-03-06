import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import styled from 'styled-components'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Vehicles from './pages/Vehicles'
import VehicleDetails from './pages/VehicleDetails'
import Maintenance from './pages/Maintenance'
import Diagnostics from './pages/Diagnostics'
import Settings from './pages/Settings'

import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  /* Adjust margin for the floating sidebar (280px width + 20px left margin + 20px right gap) */
  margin-left: ${props => props.$isAuthenticated ? '320px' : '0'};
  transition: margin-left 0.3s ease-in-out;
  
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AppContainer>
            {isAuthenticated && <Sidebar />}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                <MainContent $isAuthenticated={isAuthenticated}>
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
