import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../api/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;