import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Produit from './models/Produit.js';
import Commande from './models/Commande.js';
import User from './models/User.js';
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
const origines = ['http://localhost:5173',"http://localhost:4173", process.env.FRONTEND_URL].filter(Boolean);

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
// Changer le statut d'une commande (ADMIN seulement)
// ========================================
app.patch('/api/commandes/:id/statut', verifyToken, isAdmin, async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {

      return res.status(404).json({
        message: 'Commande introuvable'
      });

    }

    const { statut } = req.body;

    const statutsValides = ['En attente', 'Expédiée', 'Livrée', 'Annulée'];

    if (!statutsValides.includes(statut)) {

      return res.status(400).json({
        message: 'Statut invalide'
      });

    }

    const commande = await Commande.findById(req.params.id);

    if (!commande) {

      return res.status(404).json({
        message: 'Commande introuvable'
      });

    }

    // On retient si elle était DÉJÀ annulée AVANT de changer le statut,
    // pour ne jamais restituer le stock deux fois sur la même commande.
    const etaitDejaAnnulee = commande.statut === 'Annulée';

    commande.statut = statut;
    await commande.save();

    // On ne remet le stock que si elle DEVIENT annulée maintenant
    // (et qu'elle ne l'était pas déjà).
    if (statut === 'Annulée' && !etaitDejaAnnulee) {

      for (const ligne of commande.produits) {

        await Produit.updateOne(
          { _id: ligne.produitId },
          { $inc: { stock: ligne.quantite } }
        );

      }

    }

    res.json(commande);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ========================================
// Utilisateurs : liste (ADMIN seulement)
// ========================================
app.get('/api/utilisateurs', verifyToken, isAdmin, async (req, res) => {

  try {

    const utilisateurs = await User.find().sort({ createdAt: -1 });

    res.json(utilisateurs.map(function (u) {
      return u.versPublic();
    }));

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ========================================
// Utilisateurs : changer le rôle (ADMIN seulement)
// ========================================
app.patch('/api/utilisateurs/:id/role', verifyToken, isAdmin, async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {

      return res.status(404).json({
        message: 'Utilisateur introuvable'
      });

    }

    // Garde-fou : un admin ne peut pas changer son propre rôle
    // (sinon il pourrait se retirer les droits admin par erreur, ou se les donner en double)
    if (String(req.params.id) === String(req.user._id)) {

      return res.status(400).json({
        message: 'Tu ne peux pas modifier ton propre rôle'
      });

    }

    const { role } = req.body;

    if (!['client', 'admin'].includes(role)) {

      return res.status(400).json({
        message: 'Rôle invalide'
      });

    }

    const utilisateur = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after' }
    );

    if (!utilisateur) {

      return res.status(404).json({
        message: 'Utilisateur introuvable'
      });

    }

    res.json(utilisateur.versPublic());

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ========================================
// Utilisateurs : bloquer / débloquer (ADMIN seulement)
// ========================================
app.patch('/api/utilisateurs/:id/bloquer', verifyToken, isAdmin, async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {

      return res.status(404).json({
        message: 'Utilisateur introuvable'
      });

    }

    // Garde-fou : un admin ne peut pas se bloquer lui-même
    // (sinon il pourrait se retrouver enfermé dehors, sans personne pour le débloquer)
    if (String(req.params.id) === String(req.user._id)) {

      return res.status(400).json({
        message: 'Tu ne peux pas te bloquer toi-même'
      });

    }

    const { bloque } = req.body;

    if (typeof bloque !== 'boolean') {

      return res.status(400).json({
        message: 'Valeur invalide'
      });

    }

    const utilisateur = await User.findByIdAndUpdate(
      req.params.id,
      { bloque },
      { returnDocument: 'after' }
    );

    if (!utilisateur) {

      return res.status(404).json({
        message: 'Utilisateur introuvable'
      });

    }

    res.json(utilisateur.versPublic());

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ========================================
// Statistiques (ADMIN seulement)
// ========================================
app.get('/api/stats', verifyToken, isAdmin, async (req, res) => {

  try {

    // Le chiffre d'affaires : seulement les commandes vraiment livrées
    // (une commande "En attente" ou "Annulée" n'est pas un revenu réel)
    const caResultat = await Commande.aggregate([
      { $match: { statut: 'Livrée' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const chiffreAffaires = caResultat.length ? caResultat[0].total : 0;

    // Top produits : on éclate chaque ligne "produits" de chaque commande livrée,
    // puis on additionne les quantités par produit.
    const topProduits = await Commande.aggregate([
      { $match: { statut: 'Livrée' } },
      { $unwind: '$produits' },
      {
        $group: {
          _id: '$produits.produitId',
          nom: { $first: '$produits.nom' },
          quantite: { $sum: '$produits.quantite' },
          chiffreAffaires: {
            $sum: { $multiply: ['$produits.prix', '$produits.quantite'] }
          }
        }
      },
      { $sort: { quantite: -1 } },
      { $limit: 5 }
    ]);

    // Ventes des 7 derniers jours (toutes commandes non annulées, jour par jour)
    const commandes = await Commande.find({ statut: { $ne: 'Annulée' } }).select('total date');

    const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const ventes7j = [];

    for (let i = 6; i >= 0; i--) {

      const debut = new Date();
      debut.setHours(0, 0, 0, 0);
      debut.setDate(debut.getDate() - i);

      const fin = new Date(debut);
      fin.setDate(fin.getDate() + 1);

      const ventesDuJour = commandes
        .filter(function (c) {
          return c.date >= debut && c.date < fin;
        })
        .reduce(function (somme, c) {
          return somme + c.total;
        }, 0);

      ventes7j.push({ jour: JOURS[debut.getDay()], ventes: ventesDuJour });

    }

    const nbCommandes = await Commande.countDocuments();
    const nbProduits = await Produit.countDocuments();
    const nbUtilisateurs = await User.countDocuments();

    res.json({
      chiffreAffaires,
      nbCommandes,
      nbProduits,
      nbUtilisateurs,
      topProduits,
      ventes7j
    });

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