
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function ProductDetaille() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');
    setProduit(null);

    api.get(`/produits/${id}`)
      .then((res) => {
        if (active) {
          setProduit(res.data);
        }
      })
      .catch((err) => {
        console.error('Erreur de chargement :', err);

        if (active) {
          if (err.response?.status === 404) {
            setError('Ce produit est introuvable.');
          } else {
            setError(
              'Impossible de charger le produit. Vérifiez votre connexion et réessayez.'
            );
          }
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
  }, [id]);

  if (loading) {
    return (
      <main className="page-container product-state">
        <p role="status">Chargement du produit...</p>
      </main>
    );
  }

  if (error || !produit) {
    return (
      <main className="page-container product-state">
        <div className="product-error">
          <h1>Produit indisponible</h1>
          <p>{error || 'Ce produit est introuvable.'}</p>

          <Link
            to="/products"
            className="btn-modern btn-modern-primary"
          >
            Retour aux produits
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <div className="page-container">

        <nav className="product-breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/products">Produits</Link>
          <span>/</span>
          <span>{produit.nom}</span>
        </nav>

        <section className="product-detail-layout">

          <div className="product-detail-image">
            <img
              src={produit.chemin}
              alt={produit.nom || 'Produit électronique'}
            />
          </div>

          <div className="product-detail-info">

            {produit.categorie && (
              <span className="product-card-category">
                {produit.categorie}
              </span>
            )}

            <h1>{produit.nom}</h1>

            <p className="product-detail-price">
              {produit.prix} DA
            </p>

            <div className="product-detail-divider" />

            <h2>Description du produit</h2>

            <p className="product-detail-description">
              {produit.description ||
                'Aucune description disponible pour ce produit.'}
            </p>

            <button
              type="button"
              className="btn-modern btn-modern-primary product-detail-add"
              onClick={() => addToCart(produit)}
            >
              Ajouter au panier
            </button>

            <Link
              to="/products"
              className="product-back-link"
            >
              ← Continuer les achats
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetaille;
