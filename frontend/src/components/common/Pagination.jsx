import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      <button
        style={{ ...styles.btn, ...(currentPage === 1 ? styles.disabled : {}) }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Précédent
      </button>
      
      <div style={styles.pagesWrapper}>
        {pages.map(page => (
          <button
            key={page}
            style={{ 
              ...styles.pageBtn, 
              ...(page === currentPage ? styles.activePage : {}) 
            }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        style={{ ...styles.btn, ...(currentPage === totalPages ? styles.disabled : {}) }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Suivant
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
    padding: '1rem 0',
  },
  pagesWrapper: {
    display: 'flex',
    gap: '0.25rem',
  },
  btn: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#333',
    transition: 'background-color 0.2s',
  },
  pageBtn: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#333',
  },
  activePage: {
    backgroundColor: '#3498db',
    color: '#fff',
    borderColor: '#3498db',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: '#f9f9f9',
  }
};

export default Pagination;
