import mongoose from 'mongoose';

const produitSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true
    },

    prix: {
      type: Number,
      required: true
    },

    categorie: {
      type: String,
      required: true
    },

    stock: {
      type: Number,
      required: true
    },

    chemin: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Produit = mongoose.model('Produit', produitSchema);

export default Produit;
//username : yakoub1992
//password : yakoub123
//mongodb+srv://yakoub1992:<db_password>@cluster0.kbv6xjv.mongodb.net/?appName=Cluster0