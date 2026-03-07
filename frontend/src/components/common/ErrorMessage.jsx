import { LuCircleAlert } from 'react-icons/lu';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-banner">
      <LuCircleAlert size={20} className="error-banner-icon" />
      <span className="error-banner-text">{message}</span>
    </div>
  );
};

export default ErrorMessage;
