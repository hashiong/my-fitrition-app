import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  let location = useLocation();
  console.log("current user from require: ", currentUser)

  if (!currentUser) {
    // Redirect the user to the login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
