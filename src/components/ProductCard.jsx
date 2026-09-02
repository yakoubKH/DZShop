import { Link } from 'react-router-dom'
import { products } from '../data/products';

function ProductCard({ produit }) {
  return (
    <div className="card custom-card">
  <img src={produit.chemin} className="card-img-top" alt="Description de l'image"/>
  <div className="card-body">
    <h5 className="card-title">{produit.nom} </h5>
    <p className="card-text"> {produit.categorie} </p>
    <a href="#" class="btn btn-primary"> {produit.prix} </a>
  </div>
</div>
  )
}

export default ProductCard