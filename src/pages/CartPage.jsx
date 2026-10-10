
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function CartPage() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    total
  } = useCart();

  // Informations du client
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');

  // État de la commande
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  // Validation de la commande
  async function validerCommande(e) {
    e.preventDefault();

    if (cartItems.length === 0) {
      setErreur('Votre panier est vide.');
      return;
    }

    setMessage('');
    setErreur('');
    setChargement(true);

    try {
      const commande = await api.post('/commandes', {
        cartItems: cartItems.map(function (item) {
          return {
            _id: item._id,
            quantite: item.quantity
          };
        }),
        nom: nom,
        email: email,
        telephone: telephone,
        adresse: adresse
      });

      console.log('Commande créée :', commande.data);

      setMessage(
        'Commande créée avec succès ! Numéro de commande : ' +
        commande.data._id
      );

      clearCart();

      // Vider le formulaire après la réussite
      setNom('');
      setEmail('');
      setTelephone('');
      setAdresse('');

    } catch (error) {
      console.error('Erreur création commande :', error);

      if (error.response) {
        setErreur(
          error.response.data?.message ||
          'Erreur lors de la création de la commande.'
        );
      } else {
        setErreur('Impossible de contacter le serveur.');
      }
    } finally {
      setChargement(false);
    }
  }

  // Panier vide
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="page-container">

          <header className="cart-page-header">
            <span className="cart-eyebrow">DZSHOP</span>
            <h1>Mon panier</h1>
          </header>

          {message && (
            <div className="cart-alert cart-alert-success" role="status">
              <strong>Commande confirmée</strong>
              <p>{message}</p>
            </div>
          )}

          {erreur && (
            <div className="cart-alert cart-alert-error" role="alert">
              {erreur}
            </div>
          )}

          <section className="cart-empty">
            <div className="cart-empty-icon" aria-hidden="true">
              🛒
            </div>

            <h2>
              {message ? 'Merci pour votre commande !' : 'Votre panier est vide'}
            </h2>

            <p>
              {message
                ? 'Votre panier a été vidé après la création de votre commande.'
                : 'Découvrez nos produits et ajoutez vos articles préférés.'}
            </p>

            <Link
              to="/products"
              className="btn-modern btn-modern-primary"
            >
              Découvrir les produits
            </Link>
          </section>

        </div>
      </main>
    );
  }

  // Panier avec produits
  return (
    <main className="cart-page">
      <div className="page-container">

        <header className="cart-page-header">
          <span className="cart-eyebrow">DZSHOP</span>
          <h1>Mon panier</h1>
          <p>
            Vérifiez vos articles avant de confirmer votre commande.
          </p>
        </header>

        {message && (
          <div className="cart-alert cart-alert-success" role="status">
            {message}
          </div>
        )}

        {erreur && (
          <div className="cart-alert cart-alert-error" role="alert">
            {erreur}
          </div>
        )}

        <div className="cart-layout">

          {/* Liste des articles */}
          <section className="cart-products">
            <div className="cart-section-heading">
              <h2>Articles sélectionnés</h2>
              <span>
                {cartItems.length}{' '}
                {cartItems.length > 1 ? 'articles' : 'article'}
              </span>
            </div>

            {cartItems.map(function (item) {
              return (
                <article className="cart-item" key={item._id}>

                  {item.chemin ? (
                    <img
                      className="cart-item-image"
                      src={item.chemin}
                      alt={item.nom || 'Produit'}
                    />
                  ) : (
                    <div className="cart-item-image cart-image-placeholder">
                      🛍
                    </div>
                  )}

                  <div className="cart-item-info">
                    <h3>{item.nom}</h3>

                    <p className="cart-item-unit-price">
                      {item.prix} DA / unité
                    </p>

                    <strong className="cart-item-subtotal">
                      {item.prix * item.quantity} DA
                    </strong>

                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Retirer
                    </button>
                  </div>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      className="quantity-button"
                      aria-label={`Diminuer la quantité de ${item.nom}`}
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      className="quantity-button"
                      aria-label={`Augmenter la quantité de ${item.nom}`}
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  </div>

                </article>
              );
            })}

            <Link to="/products" className="cart-continue-link">
              ← Continuer mes achats
            </Link>
          </section>

          {/* Récapitulatif */}
          <aside className="cart-summary">
            <h2>Récapitulatif</h2>

            <div className="cart-summary-row">
              <span>Nombre d'articles</span>
              <strong>
                {cartItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}
              </strong>
            </div>

            <div className="cart-summary-row cart-total-row">
              <span>Total à payer</span>
              <strong>{total} DA</strong>
            </div>

            <p className="cart-summary-note">
              Le montant affiché correspond au total calculé par votre panier.
            </p>
          </aside>

        </div>

        {/* Formulaire de livraison */}
        <section className="cart-checkout">
          <div className="cart-section-heading">
            <div>
              <span className="cart-eyebrow">DERNIÈRE ÉTAPE</span>
              <h2>Informations de livraison</h2>
            </div>
          </div>

          <form onSubmit={validerCommande} className="checkout-form">

            <div className="checkout-field">
              <label htmlFor="client-nom">Nom complet</label>
              <input
                id="client-nom"
                type="text"
                className="form-control-modern"
                autoComplete="name"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                disabled={chargement}
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="client-email">Adresse e-mail</label>
              <input
                id="client-email"
                type="email"
                className="form-control-modern"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={chargement}
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="client-telephone">Téléphone</label>
              <input
                id="client-telephone"
                type="tel"
                className="form-control-modern"
                autoComplete="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                disabled={chargement}
              />
            </div>

            <div className="checkout-field checkout-field-full">
              <label htmlFor="client-adresse">Adresse de livraison</label>
              <textarea
                id="client-adresse"
                className="form-control-modern checkout-textarea"
                autoComplete="street-address"
                rows={3}
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                required
                disabled={chargement}
              />
            </div>

            <div className="checkout-submit checkout-field-full">
              <button
                type="submit"
                className="btn-modern btn-modern-primary checkout-button"
                disabled={chargement}
              >
                {chargement
                  ? 'Création de la commande...'
                  : 'Confirmer ma commande'}
              </button>
            </div>

          </form>
        </section>

      </div>
    </main>
  );
}

export default CartPage;
