import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">🛒 DZShop</Link>

        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/">Accueil</Link>
          <Link className="nav-link" to="/products">Produits</Link>
        </div>

        <Link className="btn btn-outline-light" to="/cart">🛒 Panier</Link>

      </div>
    </nav>
  )
}

export default Navbar