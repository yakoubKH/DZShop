
//**********************
//jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductDetaille() {

  // Récupérer l'id présent dans l'URL
  const { id } = useParams();

  // Produit sélectionné
  const [produit, setProduit] = useState(null);

  // Récupérer le produit depuis l'API
  useEffect(function () {

    axios.get(`http://localhost:5000/api/produits/${id}`)
      .then(function (res) {
        setProduit(res.data);
      })
      .catch(function (err) {
        console.log('Erreur :', err.message);
      });

  }, [id]);

  // Pendant le chargement
  if (!produit) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container py-5">

      <div className="row">

        {/* Image */}
        <div className="col-md-6">
          <img
            src={produit.chemin}
            className="img-fluid"
            alt={produit.nom}
          />
        </div>

        {/* Informations */}
        <div className="col-md-6">

          <h1>{produit.nom}</h1>

          <p>
            Prix : {produit.prix} DA
          </p>

          <p>
            {produit.description}
          </p>

          <button className="btn btn-primary">
            Ajouter au panier
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetaille;


