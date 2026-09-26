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
    motDePasse: {
      type: String,
      required: true,
      select: false
    },

    // "client" par défaut. On ne devient admin que dans la base (voir makeAdmin.js)
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client'
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
    role: this.role
  };
};

const User = mongoose.model('User', userSchema);

export default User;