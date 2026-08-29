import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

function ProductsPage() {
  return (
    <div className="container py-5">
      <h1>Nos produits</h1>
      <div className="row g-4 mt-1">

        {products.map(function(produit) {
          return (
            <div className="col-md-4" key={produit.id}>
              <ProductCard produit={produit} />
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default ProductsPage