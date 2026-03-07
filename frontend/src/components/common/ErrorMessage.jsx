import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div style={styles.container}>
      <strong style={styles.title}>Erreur :</strong>
      <span style={styles.text}>{message}</span>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fee2e2',
    borderLeft: '4px solid #ef4444',
    padding: '1rem',
    margin: '1rem 0',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    color: '#991b1b',
  },
  text: {
    color: '#7f1d1d',
  }
};

export default ErrorMessage;
