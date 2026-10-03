import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },

    // unique : deux comptes ne peuvent pas avoir le même email
    // lowercase : "Amel@Gmail.com" est enregistré "amel@gmail.com"
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // select: false = la requête NE renvoie PAS le mot de passe, sauf si on le demande exprès
    // required seulement pour un compte "local" : un compte Google n'a pas de mot de passe
    motDePasse: {
      type: String,
      select: false,
      required: function () {
        return this.provider === 'local';
      }
    },

    // "local" = inscrit avec email + mot de passe. "google" = connecté avec Google.
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },

    // Identifiant unique donné par Google (permet de reconnaître le compte à la connexion suivante)
    googleId: {
      type: String,
      default: null
    },

    // "client" par défaut. On ne devient admin que dans la base (voir makeAdmin.js)
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client'
    },

    // Un admin peut bloquer un compte (le compte ne pourra plus se connecter)
    bloque: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Ce qu'on a le droit de renvoyer au navigateur : JAMAIS le mot de passe
userSchema.methods.versPublic = function () {
  return {
    id: this._id,
    nom: this.nom,
    email: this.email,
    role: this.role,
    provider: this.provider,
    bloque: this.bloque
  };
};

const User = mongoose.model('User', userSchema);

export default User;