import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { LogOut, Hexagon, Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'

const NavWrapper = styled.div`
  padding: 20px 20px 0 20px;
  position: sticky;
  top: 0;
  z-index: 80;
`;

const Nav = styled(motion.nav)`
  height: 70px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: -0.5px;
  
  svg {
    color: var(--accent-cyan);
    filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4));
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  color: var(--text-secondary);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-smooth);
  position: relative;

  &:hover {
    background: rgba(255,255,255,0.08);
    color: var(--text-primary);
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--accent-magenta);
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--bg-secondary);
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 6px 16px 6px 6px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition-smooth);

  &:hover {
    background: rgba(255,255,255,0.08);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .info {
    display: flex;
    flex-direction: column;
    
    .name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .role {
      font-size: 0.65rem;
      color: var(--accent-cyan);
      font-family: 'Inter', monospace;
      letter-spacing: 0.5px;
    }
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
  transition: var(--transition-smooth);

  &:hover {
    color: var(--accent-magenta);
  }
`;

const AuthButton = styled(Link)`
  background: ${props => props.primary ? 'var(--accent-cyan)' : 'transparent'};
  color: ${props => props.primary ? '#000' : 'var(--text-primary)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(255,255,255,0.1)'};
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition-smooth);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? 'var(--glow-cyan)' : 'none'};
    background: ${props => props.primary ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)'};
  }
`;

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <NavWrapper>
            <Nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                {/* On mobile, show logo. On desktop it is in sidebar, but we keep it here for layout balance if needed, or hide it. */}
                <div style={{ display: 'flex', alignItems: 'center', width: '280px' }}>
                    {!isAuthenticated && (
                        <Logo to="/">
                            <Hexagon size={28} /> VEHTRON AI
                        </Logo>
                    )}
                </div>

                <div style={{ flex: 1 }} />

                <NavActions>
                    {isAuthenticated ? (
                        <>
                            <IconButton>
                                <Bell size={18} />
                                <span className="badge">3</span>
                            </IconButton>

                            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

                            <UserProfile>
                                <div className="avatar"><User size={16} /></div>
                                <div className="info">
                                    <span className="name">Commander</span>
                                    <span className="role">SYS_ADMIN</span>
                                </div>
                            </UserProfile>

                            <LogoutButton onClick={handleLogout} title="Disconnect Session">
                                <LogOut size={20} />
                            </LogoutButton>
                        </>
                    ) : (
                        <>
                            <AuthButton to="/login">Transmission Login</AuthButton>
                            <AuthButton to="/register" primary="true">Initialize System</AuthButton>
                        </>
                    )}
                </NavActions>
            </Nav>
        </NavWrapper>
    )
}

export default Navbar
