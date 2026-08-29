import { Link } from 'react-router-dom'

function ProductCard({ produit }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5>{produit.nom}</h5>
        <p className="text-muted small">{produit.categorie}</p>
        <p className="fw-bold text-primary fs-5">
          {produit.prix.toLocaleString('fr-DZ')} DZD
        </p>
        <Link className="btn btn-primary w-100" to={"/product/" + produit.id}>
          Voir le produit
        </Link>
      </div>
    </div>
  )
}

export default ProductCard