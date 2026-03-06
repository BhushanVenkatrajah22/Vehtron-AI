import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { LayoutDashboard, Car, Calendar, Settings, Activity, Hexagon } from 'lucide-react'

const SidebarContainer = styled(motion.aside)`
  width: 280px;
  height: calc(100vh - 40px);
  margin: 20px 0 20px 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 90;
  overflow: hidden;

  /* Decorative futuristic corner elements */
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent-cyan);
    opacity: 0.5;
    pointer-events: none;
  }

  &::before { top: 10px; left: 10px; border-right: none; border-bottom: none; }
  &::after { bottom: 10px; right: 10px; border-left: none; border-top: none; }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 2.5rem 2rem 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  .subtitle {
    font-family: 'Inter', monospace;
    font-size: 0.75rem;
    color: var(--accent-purple);
    letter-spacing: 2px;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      animation: spin 10s linear infinite;
    }
  }

  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
`;

const NavContainer = styled.nav`
  flex: 1;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 1.05rem;
  border-radius: 12px;
  transition: var(--transition-smooth);
  position: relative;
  overflow: hidden;

  .glow-dot {
    position: absolute;
    right: 20px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-cyan);
    box-shadow: var(--glow-cyan);
    opacity: 0;
    transition: var(--transition-smooth);
  }

  &.active {
    color: var(--text-primary);
    background: rgba(0, 240, 255, 0.1);
    border: 1px solid rgba(0, 240, 255, 0.2);
    
    svg {
      color: var(--accent-cyan);
    }

    .glow-dot {
      opacity: 1;
    }
  }

  &:hover:not(.active) {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const SystemStatus = styled.div`
  padding: 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-family: 'Inter', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);

  .status-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .status-value {
    color: var(--accent-emerald);
    text-shadow: var(--glow-emerald);
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <SidebarHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent-cyan)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', boxShadow: 'var(--glow-cyan)' }}>
            <Car size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Vehtron Core</h2>
            <div className="subtitle">
              <Hexagon size={12} /> OS v2.4.9
            </div>
          </div>
        </div>
      </SidebarHeader>

      <NavContainer>
        <NavItem to="/" end>
          <LayoutDashboard size={20} /> Dashboard
          <div className="glow-dot" />
        </NavItem>
        <NavItem to="/vehicles">
          <Car size={20} /> Fleet Matrix
          <div className="glow-dot" />
        </NavItem>
        <NavItem to="/maintenance">
          <Calendar size={20} /> Operations
          <div className="glow-dot" />
        </NavItem>
        <NavItem to="/diagnostics">
          <Activity size={20} /> Telemetry HUD
          <div className="glow-dot" />
        </NavItem>
        <NavItem to="/settings">
          <Settings size={20} /> Preferences
          <div className="glow-dot" />
        </NavItem>
      </NavContainer>

      <SystemStatus>
        <div className="status-row">
          <span>SYS_LINK</span>
          <span className="status-value">OPTIMAL</span>
        </div>
        <div className="status-row">
          <span>SEC_LAYER</span>
          <span className="status-value" style={{ color: 'var(--accent-cyan)', textShadow: 'var(--glow-cyan)' }}>ENCRYPTED</span>
        </div>
      </SystemStatus>
    </SidebarContainer>
  )
}

export default Sidebar
