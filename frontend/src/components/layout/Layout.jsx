import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Layout = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar de Navigation */}
      <nav style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <h1 style={styles.logoText}>Pharma<span style={styles.logoHighlight}>Manager</span></h1>
        </div>
        
        <ul style={styles.navList}>
          <li>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                color: isActive ? '#fff' : '#d1d5db',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              📊 Tableau de Bord
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/medicaments" 
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                color: isActive ? '#fff' : '#d1d5db',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              💊 Médicaments
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/ventes" 
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                color: isActive ? '#fff' : '#d1d5db',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              🛒 Ventes
            </NavLink>
          </li>
        </ul>
        
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <span style={styles.userAvatar}>👤</span>
            <span style={styles.userName}>{user?.username || 'Utilisateur'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal de la page */}
      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '"Inter", "Roboto", sans-serif',
    backgroundColor: '#f3f4f6'
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#1f2937',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    flexShrink: 0
  },
  logoContainer: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid #374151',
    marginBottom: '1rem'
  },
  logoText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '1px'
  },
  logoHighlight: {
    color: '#3b82f6'
  },
  navList: {
    listStyleType: 'none',
    padding: '0 1rem',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  navLink: {
    display: 'block',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s',
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    height: '100vh'
  },
  userSection: {
    marginTop: 'auto',
    padding: '1.5rem',
    borderTop: '1px solid #374151',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userAvatar: {
    fontSize: '1.5rem'
  },
  userName: {
    color: '#e5e7eb',
    fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  }
};

export default Layout;
