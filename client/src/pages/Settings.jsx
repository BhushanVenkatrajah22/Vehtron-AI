import React from 'react'

const Settings = () => {
    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>SYSTEM SETTINGS</h1>
            <div className="glass-panel">
                <h3>User Profile</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Encrypted identity storage active. Biometric override disabled.
                </p>
            </div>
        </div>
    )
}

export default Settings
