import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Fabrique le "badge" (token) : il contient l'id de l'utilisateur, valable 7 jours
function creerToken(utilisateur) {
  return jwt.sign(
    { id: utilisateur._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Inscription
router.post('/register', async function (req, res) {
  try {

    // On choisit les champs UN PAR UN. Jamais User.create(req.body) :
    // sinon un visiteur pourrait envoyer "role": "admin".
    const { nom, email, motDePasse } = req.body;

    // Vérifier les champs
    if (!nom || !email || !motDePasse) {
      return res.status(400).json({
        message: 'Tous les champs sont obligatoires'
      });
    }

    if (String(motDePasse).length < 6) {
      return res.status(400).json({
        message: 'Le mot de passe doit faire au moins 6 caractères'
      });
    }

    const emailPropre = String(email).toLowerCase().trim();

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExiste = await User.findOne({ email: emailPropre });

    if (utilisateurExiste) {
      return res.status(400).json({
        message: 'Cet email est déjà utilisé'
      });
    }

    // Chiffrer le mot de passe
    const motDePasseHash = await bcrypt.hash(String(motDePasse), 10);

    // Créer l'utilisateur
    const utilisateur = await User.create({
      nom,
      email: emailPropre,
      motDePasse: motDePasseHash
    });

    // On renvoie aussi le token : l'utilisateur est déjà connecté
    res.status(201).json({
      message: 'Inscription réussie',
      token: creerToken(utilisateur),
      user: utilisateur.versPublic()
    });

  } catch (error) {
    console.error('Erreur inscription :', error);

    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

// Connexion
router.post('/login', async function (req, res) {
  try {

    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({
        message: 'Email et mot de passe obligatoires'
      });
    }

    // .select('+motDePasse') : on demande EXPRÈS le mot de passe (il est caché par défaut)
    const utilisateur = await User
      .findOne({ email: String(email).toLowerCase().trim() })
      .select('+motDePasse');

    // Même message si l'email n'existe pas OU si le mot de passe est faux :
    // on n'aide pas un pirate à deviner quels emails existent.
    const motDePasseCorrect = utilisateur
      ? await bcrypt.compare(String(motDePasse), utilisateur.motDePasse)
      : false;

    if (!motDePasseCorrect) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    res.json({
      message: 'Connexion réussie',
      token: creerToken(utilisateur),
      user: utilisateur.versPublic()
    });

  } catch (error) {
    console.error('Erreur connexion :', error);

    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

// Qui suis-je ? (le site s'en servira pour vérifier que le token est encore valable)
router.get('/me', verifyToken, function (req, res) {
  res.json({ user: req.user.versPublic() });
});

export default router;