import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="bg-primary text-white text-center py-5">
      <h1>Bienvenue sur DZShop</h1>
      <p>L'électronique livrée partout en Algérie.</p>
      <Link className="btn btn-light" to="/products">Voir les produits</Link>
    </div>
  )
}
export default HomePage