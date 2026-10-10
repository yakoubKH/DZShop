
import { Link } from 'react-router-dom';

function ProductCard({ produit }) {
  return (
    <div className="product-card">

      <Link
        to={`/products/${produit._id}`}
        className="product-card-image-link"
        aria-label={`Voir le produit ${produit.nom}`}
      >
        <div className="product-card-image">
          <img
            src={produit.chemin}
            alt={produit.nom || 'Produit électronique'}
            loading="lazy"
          />
        </div>
      </Link>

      <div className="product-card-body">

        {produit.categorie && (
          <span className="product-card-category">
            {produit.categorie}
          </span>
        )}

        <h2 className="product-card-title">
          <Link to={`/products/${produit._id}`}>
            {produit.nom}
          </Link>
        </h2>

        <p className="product-card-price">
          {produit.prix} <span>DA</span>
        </p>

        <Link
          to={`/products/${produit._id}`}
          className="btn-modern btn-modern-outline product-details-button"
        >
          Voir le produit
          <span aria-hidden="true"> →</span>
        </Link>

      </div>
    </div>
  );
}

export default ProductCard;
