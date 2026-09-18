
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Search from '../context/Search';

function ProductsPage() {

  // Liste des produits
  const [products, setProducts] = useState([]);

  // Texte de recherche
  const [research, setResearch] = useState("");

  // Panier
  const { addToCart } = useCart();

  // Récupération des produits depuis MongoDB / API
  useEffect(function () {

    axios.get('http://localhost:5000/api/produits')
      .then(function (res) {
        setProducts(res.data);
      })
      .catch(function (err) {
        console.log('Erreur :', err.message);
      });

  }, []);

  // Filtrer les produits selon la recherche
  const ProductFiltrer = products.filter(function (product) {

    return product.nom
      .toLowerCase()
      .includes(research.toLowerCase());

  });

  return (
    <div className="container py-5">

      <h1>Nos produits</h1>

      {/* Barre de recherche */}
      <div>
        <Search
          research={research}
          setResearch={setResearch}
        />
      </div>

      {/* Liste des produits */}
      <div className="row g-4 mt-1">

        {ProductFiltrer.map(function (produit) {

          return (
            <div
              className="col-md-4"
              key={produit._id}
            >

              {/* Carte du produit */}
              <ProductCard produit={produit} />

              {/* Ajouter au panier */}
              <button
                onClick={function () {
                  addToCart(produit);
                }}
              >
                Ajouter au panier
              </button>

            </div>
          );

        })}

      </div>

    </div>
  );
}

export default ProductsPage;

