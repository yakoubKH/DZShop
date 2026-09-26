import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Produit from './models/Produit.js';
import Commande from './models/Commande.js';
import authRouter from './routes/auth.js';
import { verifyToken, isAdmin } from './middleware/auth.js';

dotenv.config();

// Sans phrase secrète, on ne démarre pas : mieux vaut planter que d'être vulnérable
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET manquant dans le fichier .env');
}

const app = express();

// Qui a le droit d'appeler l'API depuis un navigateur ?
// En local : Vite (port 5173). En ligne : l'adresse de ton site (variable FRONTEND_URL).
const origines = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);

app.use(cors({ origin: origines }));
app.use(express.json());
app.use('/api/auth', authRouter);

app.get('/', function (req, res) {
  res.json({ message: 'API DZShop en ligne' });
});


// ========================================
// Récupérer tous les produits (public)
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
// Récupérer un seul produit (public)
// ========================================
app.get('/api/produits/:id', async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {

      return res.status(404).json({
        message: 'Produit introuvable'
      });

    }

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
// Ajouter un produit (ADMIN seulement)
// ========================================
app.post('/api/produits', verifyToken, isAdmin, async (req, res) => {

  try {

    // On choisit les champs un par un (jamais Produit.create(req.body))
    const { nom, prix, categorie, stock, chemin } = req.body;

    const produit = await Produit.create({
      nom: nom,
      prix: prix,
      categorie: categorie,
      stock: stock,
      chemin: chemin
    });

    res.status(201).json(produit);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

});


// ========================================
// Modifier un produit (ADMIN seulement)
// ========================================
app.put('/api/produits/:id', verifyToken, isAdmin, async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {

      return res.status(404).json({
        message: 'Produit introuvable'
      });

    }

    const { nom, prix, categorie, stock, chemin } = req.body;

    // returnDocument: 'after' renvoie le produit APRÈS modification,
    // runValidators: true réapplique tes règles (required...) à la modification aussi.
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      { nom, prix, categorie, stock, chemin },
      { returnDocument: 'after', runValidators: true }
    );

    if (!produit) {

      return res.status(404).json({
        message: 'Produit introuvable'
      });

    }

    res.json(produit);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

});


// ========================================
// Supprimer un produit (ADMIN seulement)
// ========================================
app.delete('/api/produits/:id', verifyToken, isAdmin, async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {

      return res.status(404).json({
        message: 'Produit introuvable'
      });

    }

    const produit = await Produit.findByIdAndDelete(req.params.id);

    if (!produit) {

      return res.status(404).json({
        message: 'Produit introuvable'
      });

    }

    res.json({
      message: 'Produit supprimé'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


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
    if (!Array.isArray(cartItems) || cartItems.length === 0) {

      return res.status(400).json({
        message: 'Panier vide'
      });

    }

    if (!nom || !email || !telephone || !adresse) {

      return res.status(400).json({
        message: 'Nom, email, téléphone et adresse obligatoires'
      });

    }

    // 1) On VÉRIFIE tout AVANT de toucher au stock.
    //    Le navigateur envoie seulement { _id, quantite } : les PRIX viennent de MongoDB.
    const quantites = {};

    for (const item of cartItems) {

      const quantite = Number(item.quantite);

      if (!mongoose.isValidObjectId(item._id)) {

        return res.status(400).json({
          message: 'Produit invalide'
        });

      }

      if (!Number.isInteger(quantite) || quantite < 1 || quantite > 99) {

        return res.status(400).json({
          message: 'Quantité invalide'
        });

      }

      // Si le même produit apparaît 2 fois, on additionne
      const id = String(item._id);
      quantites[id] = (quantites[id] || 0) + quantite;

    }

    const ids = Object.keys(quantites);
    const produits = await Produit.find({ _id: { $in: ids } });

    let total = 0;
    const produitsCommande = [];

    for (const id of ids) {

      const produit = produits.find(function (p) {
        return String(p._id) === id;
      });

      if (!produit) {

        return res.status(400).json({
          message: 'Produit introuvable'
        });

      }

      if (quantites[id] > produit.stock) {

        return res.status(400).json({
          message: `Stock insuffisant pour le produit : ${produit.nom}`
        });

      }

      total += produit.prix * quantites[id];

      produitsCommande.push({
        produitId: produit._id.toString(),
        nom: produit.nom,
        prix: produit.prix,
        quantite: quantites[id]
      });

    }

    // 2) On retire du stock. La condition stock >= quantité est vérifiée par MongoDB
    //    au moment même : deux clients en même temps ne peuvent pas acheter le dernier article.
    const retires = [];

    for (const ligne of produitsCommande) {

      const resultat = await Produit.updateOne(
        { _id: ligne.produitId, stock: { $gte: ligne.quantite } },
        { $inc: { stock: -ligne.quantite } }
      );

      if (resultat.modifiedCount === 0) {

        // Un autre client a pris le stock entre-temps : on REMET ce qu'on avait retiré
        for (const dejaRetire of retires) {
          await Produit.updateOne(
            { _id: dejaRetire.produitId },
            { $inc: { stock: dejaRetire.quantite } }
          );
        }

        return res.status(400).json({
          message: `Stock insuffisant pour le produit : ${ligne.nom}`
        });

      }

      retires.push(ligne);

    }

    // 3) Créer la commande
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
// Toutes les commandes (ADMIN seulement)
// ========================================
app.get('/api/commandes', verifyToken, isAdmin, async (req, res) => {

  try {

    const commandes = await Commande.find().sort({ date: -1 });

    res.json(commandes);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ========================================
// Connexion MongoDB + démarrage serveur
// ========================================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)

  .then(() => {

    console.log('MongoDB connecté');

    app.listen(PORT, () => {

      console.log(
        'Serveur démarré sur http://localhost:' + PORT
      );

    });

  })

  .catch((error) => {

    console.log(
      'Erreur MongoDB :',
      error.message
    );

  });