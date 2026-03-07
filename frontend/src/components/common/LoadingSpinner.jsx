const LoadingSpinner = ({ text = 'Chargement...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
