
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Produit from './models/Produit.js';
import Commande from './models/Commande.js';
import authRouter from './routes/auth.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

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
// Récupérer un seul produit
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
/// ------------------------------------------
// ========================================
// Créer une commande
// ========================================
app.post('/api/commandes', async (req, res) => {

  try {

    const {
      cartItems,
      nom,
      email,
      telephone,
      adresse
    } = req.body;

    // Vérifier si le panier est vide
    if (!cartItems || cartItems.length === 0) {

      return res.status(400).json({
        message: 'Panier vide'
      });

    }

    let total = 0;
    const produitsCommande = [];

    // Récupérer les vrais produits depuis MongoDB
    for (const item of cartItems) {

      const produit = await Produit.findById(item._id);

if (!produit) {
  continue;
}

if (item.quantite > produit.stock) {
  return res.status(400).json({
    message: `Stock insuffisant pour le produit : ${produit.nom}`
  });
}
total += produit.prix * item.quantite;

produitsCommande.push({
  produitId: produit._id.toString(),
  nom: produit.nom,
  prix: produit.prix,
  quantite: item.quantite
});

// إنقاص المخزون
await Produit.findByIdAndUpdate(
  item._id,
  {
    $inc: {
      stock: -item.quantite
    }
  }
);

    }

    // Créer la commande
    const commande = await Commande.create({

      client: {
        nom,
        email,
        telephone,
        adresse
      },

      produits: produitsCommande,

      total

    });

    res.status(201).json(commande);

  } catch (error) {

    console.error('Erreur création commande :', error);

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

