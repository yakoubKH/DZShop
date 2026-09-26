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

  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);


  // ========================================
  // Valider la commande
  // ========================================
  async function validerCommande(e) {

    e.preventDefault();

    setMessage('');
    setErreur('');
    setChargement(true);

    try {

      const commande = await api.post(
        '/commandes',
        {
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
        }
      );

      console.log('Commande créée :', commande.data);

      setMessage(
        'Commande créée avec succès ! Numéro de commande : ' +
        commande.data._id
      );
      clearCart();

      // Vider le formulaire
      setNom('');
      setEmail('');
      setTelephone('');
      setAdresse('');

    } catch (error) {

      console.error(
        'Erreur création commande :',
        error
      );

      if (error.response) {

        setErreur(
          error.response.data.message ||
          'Erreur lors de la création de la commande.'
        );

      } else {

        setErreur(
          'Impossible de contacter le serveur.'
        );

      }

    } finally {

      setChargement(false);

    }

  }


  // ========================================
  // Panier vide
  // ========================================
  if (cartItems.length === 0) {

    return (
      <div className="container py-5">

        <h1>Panier</h1>

        {/* Après la commande, clearCart() vide le panier : on affiche donc ICI
            le message de confirmation (sinon le client ne le verrait jamais) */}
        {message && (
          <div className="alert alert-success mt-3">
            {message}
          </div>
        )}

        {!message && (
          <p>
            Ton panier est vide pour l'instant.
          </p>
        )}

        <Link className="btn btn-primary" to="/products">
          Continuer mes achats
        </Link>

      </div>
    );

  }


  // ========================================
  // Affichage du panier
  // ========================================
  return (
    <div className="container py-5">

      <h1>Panier</h1>


      {/* ========================================
          Produits du panier
      ======================================== */}

      {cartItems.map(function (item) {

        return (
          <div
            key={item._id}
            className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded"
          >

            <div>

              <h5>
                {item.nom}
              </h5>

              <p className="mb-1">
                Prix : {item.prix} DA
              </p>

              <p className="mb-0">
                Sous-total : {item.prix * item.quantity} DA
              </p>

            </div>


            <div className="d-flex align-items-center gap-2">

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={function () {
                  decreaseQuantity(item._id);
                }}
              >
                −
              </button>

              <span>
                {item.quantity}
              </span>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={function () {
                  addToCart(item);
                }}
              >
                +
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={function () {
                  removeFromCart(item._id);
                }}
              >
                Retirer
              </button>

            </div>

          </div>
        );

      })}


      {/* ========================================
          Total
      ======================================== */}

      <h2 className="mt-4">
        Total : {total} DA
      </h2>


      {/* ========================================
          Formulaire commande
      ======================================== */}

      <div className="mt-5">

        <h2>
          Informations de livraison
        </h2>


        {message && (
          <div className="alert alert-success mt-3">
            {message}
          </div>
        )}


        {erreur && (
          <div className="alert alert-danger mt-3">
            {erreur}
          </div>
        )}


        <form
          onSubmit={validerCommande}
          className="mt-4"
        >

          {/* Nom */}

          <div className="mb-3">

            <label className="form-label">
              Nom
            </label>

            <input
              type="text"
              className="form-control"
              value={nom}
              onChange={function (e) {
                setNom(e.target.value);
              }}
              required
            />

          </div>


          {/* Email */}

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={function (e) {
                setEmail(e.target.value);
              }}
              required
            />

          </div>


          {/* Téléphone */}

          <div className="mb-3">

            <label className="form-label">
              Téléphone
            </label>

            <input
              type="tel"
              className="form-control"
              value={telephone}
              onChange={function (e) {
                setTelephone(e.target.value);
              }}
              required
            />

          </div>


          {/* Adresse */}

          <div className="mb-3">

            <label className="form-label">
              Adresse
            </label>

            <textarea
              className="form-control"
              rows="3"
              value={adresse}
              onChange={function (e) {
                setAdresse(e.target.value);
              }}
              required
            />

          </div>


          {/* Bouton */}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={chargement}
          >

            {chargement
              ? 'Création de la commande...'
              : 'Valider la commande'
            }

          </button>

        </form>

      </div>

    </div>
  );
}

export default CartPage;