
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { nbItems } = useCart();
  const { user, logout } = useAuth();
  console.log('Utilisateur connecté :', user);
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="navbar-shell">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon">DZ</span>
          <span className="brand-name">
            DZShop
            <small>Votre boutique en ligne</small>
          </span>
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-content ${menuOpen ? 'is-open' : ''}`}>
          <div className="navbar-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Accueil
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Produits
            </NavLink>

            {user?.role === 'admin' && (
              <div className="admin-nav-group">
                <span className="admin-nav-label">Administration</span>
                <div className="admin-nav-dropdown">
                  <NavLink to="/admin/produits" onClick={closeMenu}>
                    Gestion des produits
                  </NavLink>
                  <NavLink to="/admin/commandes" onClick={closeMenu}>
                    Gestion des commandes
                  </NavLink>
                  <NavLink to="/admin/utilisateurs" onClick={closeMenu}>
                    Gestion des utilisateurs
                  </NavLink>
                  <NavLink to="/admin/stats" onClick={closeMenu}>
                    Statistiques
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          <div className="navbar-actions">
            {user ? (
              <div className="navbar-user">
                <span className="user-avatar">
                  {user.nom?.charAt(0)?.toUpperCase() || 'U'}
                </span>

                <span className="user-greeting">
                  Bonjour, <strong>{user.nom}</strong>
                </span>

                <button
                  type="button"
                  className="navbar-button navbar-button-outline"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="navbar-button navbar-button-outline"
                onClick={closeMenu}
              >
                Connexion
              </Link>
            )}

            <Link
              to="/cart"
              className="cart-button"
              onClick={closeMenu}
              aria-label={`Panier, ${nbItems} article(s)`}
            >
              <span className="cart-icon" aria-hidden="true">🛒</span>
              <span>Panier</span>
              <span className="cart-count">{nbItems}</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
