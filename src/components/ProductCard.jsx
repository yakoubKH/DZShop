
import { Link } from 'react-router-dom';

function ProductCard({ produit }) {

  return (
    <div className="card custom-card">

      <img
        src={produit.chemin}
        className="card-img-top"
        alt={produit.nom}
      />

      <div className="card-body">

        <h5 className="card-title">
          {produit.nom}
        </h5>

        <p className="card-text">
          {produit.categorie}
        </p>

        <p className="card-text">
          {produit.prix} DA
        </p>

        <Link
          to={`/products/${produit._id}`}
          className="btn btn-primary"
        >
          Voir le produit
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;

