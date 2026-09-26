import mongoose from 'mongoose';

const commandeSchema = new mongoose.Schema({
  client: {
    nom: String,
    email: String,
    telephone: String,
    adresse: String
  },

  produits: [
    {
      produitId: String,
      nom: String,
      prix: Number,
      quantite: Number
    }
  ],

  total: Number,

  // En attente, Livrée... (l'admin pourra le changer plus tard)
  statut: {
    type: String,
    enum: ['En attente', 'Expédiée', 'Livrée', 'Annulée'],
    default: 'En attente'
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const Commande = mongoose.model('Commande', commandeSchema);

export default Commande;