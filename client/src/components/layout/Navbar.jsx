import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { LogOut, User as UserIcon, Zap } from 'lucide-react'

const Nav = styled.nav`
  height: 70px;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--accent-cyan);
  text-decoration: none;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
`;

const NavActions = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--accent-cyan);
    color: var(--bg-primary);
    box-shadow: 0 0 15px var(--accent-cyan);
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
        <Nav>
            <Logo to="/">
                <Zap fill="currentColor" /> VEHTRON AI
            </Logo>
            <NavActions>
                {isAuthenticated ? (
                    <Button onClick={handleLogout}>
                        <LogOut size={18} /> LOGOUT
                    </Button>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button>LOGIN</Button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Button style={{ borderColor: 'var(--accent-magenta)', color: 'var(--accent-magenta)' }}>REGISTER</Button>
                        </Link>
                    </>
                )}
            </NavActions>
        </Nav>
    )
}

export default Navbar
