
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import Produit from './models/Produit.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// Récupérer tous les produits
// ========================================
app.get('/api/produits', async (req, res) => {

  try {

    const produits = await Produit.find();

    res.json(produits);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ========================================
// Récupérer un seul produit par son ID
// ========================================
app.get('/api/produits/:id', async (req, res) => {

  try {

    const produit = await Produit.findById(req.params.id);

    if (!produit) {

      return res.status(404).json({
        message: 'Produit introuvable'
      });

    }

    res.json(produit);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ========================================
// Connexion MongoDB + démarrage serveur
// ========================================
mongoose.connect(process.env.MONGO_URI)

  .then(() => {

    console.log('MongoDB connecté');

    app.listen(5000, () => {

      console.log(
        'Serveur démarré sur http://localhost:5000'
      );

    });

  })

  .catch((error) => {

    console.log(
      'Erreur MongoDB :',
      error.message
    );

  });

