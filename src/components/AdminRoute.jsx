import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protège les pages admin : redirige vers l'accueil si on n'est pas admin
function AdminRoute({ children }) {

  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;

}

export default AdminRoute;