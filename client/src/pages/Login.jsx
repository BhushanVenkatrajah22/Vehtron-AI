import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import { motion } from 'framer-motion'

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
`;

const AuthCard = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  background: var(--bg-secondary);
  border: 1px solid rgba(0, 240, 255, 0.3);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--accent-cyan);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  color: white;
  width: 100%;
  outline: none;
  font-family: 'Exo 2', sans-serif;

  &:focus {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: var(--accent-cyan);
  color: var(--bg-primary);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px var(--accent-cyan);
    transform: translateY(-2px);
  }
`;

const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <AuthContainer>
            <AuthCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Title>DECRYPTION REQUIRED</Title>
                {error && <p style={{ color: 'var(--accent-magenta)', textAlign: 'center' }}>{error}</p>}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>IDENTIFIER (EMAIL)</Label>
                        <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>ACCESS CODE (PASSWORD)</Label>
                        <Input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </FormGroup>
                    <SubmitButton type="submit">ACCESS SYSTEM</SubmitButton>
                </Form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    NO ACCOUNT? <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>INITIALIZE REGISTRATION</Link>
                </p>
            </AuthCard>
        </AuthContainer >
    )
}

export default Login
