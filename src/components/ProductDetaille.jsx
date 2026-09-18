/*import ProductCard from '../components/ProductCard'
import { products } from '../data/products';
import { useParams } from 'react-router-dom';
//import { Link } from 'react-router-dom'
//import { useContext } from "react";
//import { ProductContext } from "../context/ProductContext";

   
function ProductDetaille() {
  

  const { id } = useParams();

  const produit = products.find(
    (product) => product.id === Number(id)
  );

  if (!produit) {
    return <h1>Produit introuvable</h1>;
  }

  return (
    <div className="container py-5">

      <h1>Le détail du produit</h1>

      <div className="card custom-card ">

        <img style={{width:'180px',height:'180px'}}
          src={produit.chemin}
          className="card-img-top"
          alt={produit.nom}
        />

        <div className="card-body">

          <h2>{produit.nom}</h2>

          <p>Catégorie : {produit.categorie}</p>

          <p>Prix : {produit.prix} DA</p>

          <p>Stock : {produit.stock}</p>

        </div>

      </div>

     
            
    </div>
  );
}

export default ProductDetaille;*/
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


