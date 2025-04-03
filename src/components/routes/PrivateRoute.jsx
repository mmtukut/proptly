import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading, initialized } = useAuth();
  const location = useLocation();

  // Show nothing while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1c5bde] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Redirect to sign in if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return children;
};

export default PrivateRoute;