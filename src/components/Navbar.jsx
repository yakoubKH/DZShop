import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {

  const { nbItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">

        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          🛒 DZShop
        </Link>

        <div className="navbar-nav me-auto">

          <Link
            className="nav-link"
            to="/"
          >
            Accueil
          </Link>

          <Link
            className="nav-link"
            to="/products"
          >
            Produits
          </Link>

          {user && user.role === 'admin' && (
            <>
              <Link className="nav-link" to="/admin/produits">Admin Produits</Link>
              <Link className="nav-link" to="/admin/commandes">Admin Commandes</Link>
              <Link className="nav-link" to="/admin/utilisateurs">Admin Utilisateurs</Link>
              <Link className="nav-link" to="/admin/stats">Admin Stats</Link>
            </>
          )}

        </div>

        {user ? (
          <div className="d-flex align-items-center gap-2">
            <span className="text-white">Salut {user.nom}</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Déconnexion
            </button>
          </div>
        ) : (
          <Link className="btn btn-outline-light me-2" to="/login">
            Connexion
          </Link>
        )}

        <Link
          className="btn btn-outline-light ms-2"
          to="/cart"
        >
          🛒 Panier {nbItems}
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;