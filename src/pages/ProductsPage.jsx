import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import Search from '../context/Search';
import { useState } from "react"
function ProductsPage() {
  const [research,setResearch]=useState("");
  const ProductFiltrer=products.filter((product)=>product.nom.toLowerCase().includes(research.toLowerCase()));
  return (
    <div className="container py-5">
      <h1>Nos produits</h1>
       <div>
        <Search research={research} setResearch={setResearch} />
      </div>
      <div className="row g-4 mt-1">

        {ProductFiltrer.map(function(produit) {
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