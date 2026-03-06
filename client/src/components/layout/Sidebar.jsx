import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { LayoutDashboard, Car, Calendar, Settings, Activity } from 'lucide-react'

const SidebarContainer = styled.aside`
  width: 260px;
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  z-index: 90;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  color: var(--text-secondary);
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;

  &.active {
    color: var(--accent-cyan);
    background: rgba(0, 240, 255, 0.05);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: var(--accent-cyan);
      box-shadow: 0 0 10px var(--accent-cyan);
    }
  }

  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.02);
  }
`;

const Sidebar = () => {
    return (
        <SidebarContainer>
            <NavItem to="/" end>
                <LayoutDashboard size={20} /> DASHBOARD
            </NavItem>
            <NavItem to="/vehicles">
                <Car size={20} /> VEHICLES
            </NavItem>
            <NavItem to="/maintenance">
                <Calendar size={20} /> MAINTENANCE
            </NavItem>
            <NavItem to="/diagnostics">
                <Activity size={20} /> OBD DIAGNOSTICS
            </NavItem>
            <NavItem to="/settings">
                <Settings size={20} /> SETTINGS
            </NavItem>
        </SidebarContainer>
    )
}

export default Sidebar
