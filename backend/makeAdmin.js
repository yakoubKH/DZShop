// Utilisation (depuis le dossier backend) :  node makeAdmin.js ton-email@gmail.com
// (le compte doit déjà exister : inscris-toi d'abord, avec /api/auth/register)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const email = (process.argv[2] || '').toLowerCase().trim();

if (!email) {
  console.log('Utilisation : node makeAdmin.js ton-email@gmail.com');
  process.exit(1);
}

try {

  await mongoose.connect(process.env.MONGO_URI);

  const utilisateur = await User.findOneAndUpdate(
    { email: email },
    { role: 'admin' },
    { returnDocument: 'after' }
  );

  if (!utilisateur) {
    console.log("Aucun compte avec l'email " + email + ". Inscris-toi d'abord.");
  } else {
    console.log(utilisateur.nom + ' (' + utilisateur.email + ') est maintenant admin.');
  }

} catch (error) {
  console.log('Erreur : ' + error.message);
} finally {
  await mongoose.disconnect();
}