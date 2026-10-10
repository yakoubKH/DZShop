
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Search from '../context/Search';

function ProductsPage() {
  // Liste des produits
  const [products, setProducts] = useState([]);

  // Texte de recherche
  const [research, setResearch] = useState('');

  // État de chargement
  const [loading, setLoading] = useState(true);

  // Message d'erreur
  const [error, setError] = useState('');

  // Panier
  const { addToCart } = useCart();

  // Récupération des produits depuis l'API
  useEffect(() => {
    let active = true;

    api.get('/produits')
      .then((res) => {
        if (active) {
          setProducts(
            Array.isArray(res.data) ? res.data : []
          );
        }
      })
      .catch((err) => {
        if (active) {
          console.error('Erreur de chargement :', err);
          setError(
            'Impossible de charger les produits. Veuillez réessayer.'
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Filtrer les produits
  const productsFiltered = products.filter((product) => {
    const nom = typeof product.nom === 'string'
      ? product.nom
      : '';

    return nom
      .toLowerCase()
      .includes(research.trim().toLowerCase());
  });

  return (
    <main className="products-page">
      <div className="page-container">

        {/* En-tête de la page */}
        <header className="products-header">
          <div>
            <span className="products-eyebrow">
              BOUTIQUE DZSHOP
            </span>

            <h1>Nos produits</h1>

            <p>
              Découvrez notre sélection de produits
              électroniques et trouvez ce qu'il vous faut.
            </p>
          </div>

          {!loading && !error && (
            <div className="products-count">
              <strong>{productsFiltered.length}</strong>
              <span>
                {productsFiltered.length > 1
                  ? 'produits trouvés'
                  : 'produit trouvé'}
              </span>
            </div>
          )}
        </header>

        {/* Barre de recherche */}
        <section
          className="products-search"
          aria-label="Recherche de produits"
        >
          <Search
            research={research}
            setResearch={setResearch}
          />
        </section>

        {/* Chargement */}
        {loading && (
          <div className="products-message" role="status">
            Chargement des produits...
          </div>
        )}

        {/* Erreur */}
        {!loading && error && (
          <div className="products-message products-error" role="alert">
            <p>{error}</p>

            <button
              type="button"
              className="btn-modern btn-modern-outline"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && productsFiltered.length === 0 && (
          <div className="products-empty">
            <span className="products-empty-icon">⌕</span>

            <h2>
              {research.trim()
                ? 'Aucun produit trouvé'
                : 'Aucun produit disponible'}
            </h2>

            <p>
              {research.trim()
                ? 'Essayez un autre mot-clé.'
                : 'Les produits apparaîtront ici dès qu’ils seront disponibles.'}
            </p>

            {research.trim() && (
              <button
                type="button"
                className="btn-modern btn-modern-outline"
                onClick={() => setResearch('')}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}

        {/* Grille des produits */}
        {!loading && !error && productsFiltered.length > 0 && (
          <section
            className="products-grid"
            aria-label="Liste des produits"
          >
            {productsFiltered.map((produit) => (
              <article
                className="product-item"
                key={produit._id}
              >
                <ProductCard produit={produit} />

                <button
                  type="button"
                  className="btn-modern btn-modern-primary product-add-button"
                  onClick={() => addToCart(produit)}
                >
                  Ajouter au panier
                </button>
              </article>
            ))}
          </section>
        )}

      </div>
    </main>
  );
}

export default ProductsPage;
