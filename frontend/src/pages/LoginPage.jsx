import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || "Identifiants incorrects.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1a365d' }}>
                    💊 PharmaManager
                </h1>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
                    Connexion sécurisée
                </p>
                
                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nom d'utilisateur</label>
                        <input 
                            type="text" 
                            style={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input 
                            type="password" 
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{...styles.button, opacity: loading ? 0.7 : 1}}
                        disabled={loading}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                    <p style={{fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem', color: '#94a3b8'}}>
                        Admin par défaut : admin / admin
                    </p>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#e2e8f0'
    },
    card: {
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#475569'
    },
    input: {
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.75rem',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default LoginPage;
