import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, Bell, Database, Wifi, Edit2, Lock, Smartphone, Save, AlertTriangle, Eye, EyeOff } from 'lucide-react'

const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 4rem;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-size: 1.1rem;
    font-family: 'Space Grotesk', sans-serif;
  }
`;

const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(34, 211, 238, 0.1)' : 'transparent'};
  color: ${props => props.active ? 'var(--accent-cyan)' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'rgba(34, 211, 238, 0.3)' : 'transparent'};
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-smooth);
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
  }

  svg {
    opacity: ${props => props.active ? 1 : 0.7};
  }
`;

const ContentArea = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 2.5rem;
  min-height: 500px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  svg {
    color: var(--accent-purple);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: var(--transition-smooth);

  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
  transition: var(--transition-smooth);

  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.1);
  }

  option {
    background: #0a0a0f;
    color: var(--text-primary);
  }
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  &:last-child {
    border-bottom: none;
  }

  .toggle-info {
    h4 {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
      font-weight: 500;
    }
    p {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
  }

  .switch {
    width: 50px;
    height: 26px;
    background: ${props => props.active ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)'};
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;

    &::after {
      content: '';
      position: absolute;
      top: 3px;
      left: ${props => props.active ? '27px' : '3px'};
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: left 0.3s;
    }
  }
`;

const SaveButton = styled.button`
  background: var(--accent-cyan);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  transition: var(--transition-smooth);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--glow-cyan);
  }
`;

const DangerZone = styled.div`
  margin-top: 3rem;
  padding: 1.5rem;
  border: 1px solid rgba(236, 72, 153, 0.3);
  background: rgba(236, 72, 153, 0.05);
  border-radius: 16px;

  h3 {
    color: var(--accent-magenta);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  button {
    background: transparent;
    border: 1px solid var(--accent-magenta);
    color: var(--accent-magenta);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
      background: rgba(236, 72, 153, 0.1);
    }
  }
`;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Mock States for Toggles
  const [toggles, setToggles] = useState({
    emailNotifs: true,
    pushNotifs: false,
    autoScan: true,
    telemetrySync: true,
    twoFactorAuth: false,
    biometric: false,
    darkTheme: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'profile', icon: <User size={20} />, label: 'User Profile' },
    { id: 'security', icon: <Shield size={20} />, label: 'Security & Access' },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { id: 'telemetry', icon: <Wifi size={20} />, label: 'OBD Telemetry' },
    { id: 'data', icon: <Database size={20} />, label: 'Data Management' }
  ];

  const contentVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } }
  };

  return (
    <PageContainer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Header>
        <h1>User Preferences</h1>
        <p>Manage your account settings and system configurations.</p>
      </Header>

      <SettingsLayout>
        <Sidebar>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </TabButton>
          ))}
        </Sidebar>

        <ContentArea>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                <SectionTitle><User size={24} /> Profile Information</SectionTitle>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <FormGroup>
                    <label>First Name</label>
                    <Input defaultValue="Admin" />
                  </FormGroup>
                  <FormGroup>
                    <label>Last Name</label>
                    <Input defaultValue="User" />
                  </FormGroup>
                </div>
                <FormGroup>
                  <label>Email Address</label>
                  <Input defaultValue="admin@vehtron.ai" type="email" />
                </FormGroup>
                <FormGroup>
                  <label>Phone Number</label>
                  <Input defaultValue="+1 (555) 019-2834" type="tel" />
                </FormGroup>
                <FormGroup>
                  <label>Language Preference</label>
                  <Select>
                    <option>English (US)</option>
                    <option>Español</option>
                    <option>Français</option>
                    <option>Deutsch</option>
                  </Select>
                </FormGroup>

                <SaveButton><Save size={18} /> Save Changes</SaveButton>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                <SectionTitle><Shield size={24} /> Security Settings</SectionTitle>

                <FormGroup>
                  <label>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <Input type="password" defaultValue="********" />
                    <Eye size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer' }} />
                  </div>
                </FormGroup>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <FormGroup>
                    <label>New Password</label>
                    <Input type="password" placeholder="Min 8 characters" />
                  </FormGroup>
                  <FormGroup>
                    <label>Confirm Password</label>
                    <Input type="password" />
                  </FormGroup>
                </div>
                <SaveButton style={{ marginBottom: '3rem' }}>Update Password</SaveButton>

                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Advanced Authentication</h3>
                <ToggleSwitch active={toggles.twoFactorAuth} onClick={() => handleToggle('twoFactorAuth')}>
                  <div className="toggle-info">
                    <h4>Two-Factor Authentication (2FA)</h4>
                    <p>Require a code from an authenticator app when logging in.</p>
                  </div>
                  <div className="switch" />
                </ToggleSwitch>
                <ToggleSwitch active={toggles.biometric} onClick={() => handleToggle('biometric')}>
                  <div className="toggle-info">
                    <h4>Biometric Login Support</h4>
                    <p>Allow fingerprint/FaceID on supported mobile clients.</p>
                  </div>
                  <div className="switch" />
                </ToggleSwitch>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                <SectionTitle><Bell size={24} /> Notification Preferences</SectionTitle>

                <ToggleSwitch active={toggles.emailNotifs} onClick={() => handleToggle('emailNotifs')}>
                  <div className="toggle-info">
                    <h4>Email Alerts</h4>
                    <p>Receive maintenance reminders and critical alerts via email.</p>
                  </div>
                  <div className="switch" />
                </ToggleSwitch>
                <ToggleSwitch active={toggles.pushNotifs} onClick={() => handleToggle('pushNotifs')}>
                  <div className="toggle-info">
                    <h4>Push Notifications</h4>
                    <p>Receive instant notifications on your browser/mobile device.</p>
                  </div>
                  <div className="switch" />
                </ToggleSwitch>

                <FormGroup style={{ marginTop: '2rem' }}>
                  <label>Alert Threshold Level</label>
                  <Select defaultValue="medium">
                    <option value="low">Low (All Events)</option>
                    <option value="medium">Medium (Warnings & Critical)</option>
                    <option value="high">High (Critical DTCs Only)</option>
                  </Select>
                </FormGroup>
              </motion.div>
            )}

            {activeTab === 'telemetry' && (
              <motion.div key="telemetry" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                <SectionTitle><Wifi size={24} /> OBD-II Connection Settings</SectionTitle>

                <ToggleSwitch active={toggles.autoScan} onClick={() => handleToggle('autoScan')}>
                  <div className="toggle-info">
                    <h4>Auto-Scan on Connect</h4>
                    <p>Automatically interpret DTCs instantly when OBD device pairs.</p>
                  </div>
                  <div className="switch" />
                </ToggleSwitch>
                <ToggleSwitch active={toggles.telemetrySync} onClick={() => handleToggle('telemetrySync')}>
                  <div className="toggle-info">
                    <h4>Cloud Telemetry Sync</h4>
                    <p>Upload live engine metrics to Vehtron servers for deeper AI analysis.</p>
                  </div>
                  <div className="switch" />
                </ToggleSwitch>

                <FormGroup style={{ marginTop: '2rem' }}>
                  <label>Default ELM327 Protocol</label>
                  <Select defaultValue="auto">
                    <option value="auto">Automatic (Recommended)</option>
                    <option value="iso15765">ISO 15765-4 (CAN 11/500)</option>
                    <option value="iso9141">ISO 9141-2</option>
                    <option value="j1850">SAE J1850 PWM</option>
                  </Select>
                </FormGroup>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div key="data" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                <SectionTitle><Database size={24} /> Data Management</SectionTitle>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                  Manage how your diagnostic data and service histories are stored. Vehtron uses end-to-end encryption for all transmitted telemetry.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Export Data Archive</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Download JSON copy of all vehicles and logs.</p>
                    <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px 16px', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Generate Export</button>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sync History</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Force sync local database with cloud server.</p>
                    <button style={{ background: 'rgba(34, 211, 238, 0.2)', color: 'var(--accent-cyan)', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Resync Now</button>
                  </div>
                </div>

                <DangerZone>
                  <h3><AlertTriangle size={20} /> Danger Zone</h3>
                  <p>Permanently delete your account and all associated telemetry data, service history, and vehicle logs. This action cannot be undone.</p>
                  <button>Delete Account</button>
                </DangerZone>
              </motion.div>
            )}
          </AnimatePresence>
        </ContentArea>
      </SettingsLayout>
    </PageContainer>
  )
}

export default Settings
