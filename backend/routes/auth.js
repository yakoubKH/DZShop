import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Le client Google : il sait vérifier qu'un jeton vient bien de Google
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    // Un compte créé avec Google n'a pas de mot de passe : on l'explique au lieu
    // de laisser bcrypt planter sur "undefined"
    if (utilisateur && utilisateur.provider === 'google') {
      return res.status(400).json({
        message: 'Ce compte utilise la connexion Google. Clique sur "Continuer avec Google".'
      });
    }

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

    if (utilisateur.bloque) {
      return res.status(403).json({
        message: 'Ce compte a été bloqué'
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

// Connexion / inscription avec Google
router.post('/google', async function (req, res) {
  try {

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: 'Jeton Google manquant'
      });
    }

    // Google vérifie lui-même que le jeton est authentique (signature, date d'expiration...)
    // Si le jeton est invalide ou trafiqué, verifyIdToken lève une erreur : direction le catch, 401.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        message: 'Compte Google non valide'
      });
    }

    const emailPropre = payload.email.toLowerCase().trim();

    // On cherche si cet email existe déjà (inscrit avec mot de passe, par exemple)
    let utilisateur = await User.findOne({ email: emailPropre });

    if (!utilisateur) {

      // Première connexion Google : on crée le compte directement
      utilisateur = await User.create({
        nom: payload.name || emailPropre.split('@')[0],
        email: emailPropre,
        provider: 'google',
        googleId: payload.sub
      });

    } else if (!utilisateur.googleId) {

      // Le compte existait déjà (créé avec mot de passe) : on FUSIONNE,
      // on ne crée jamais un deuxième compte pour le même email.
      utilisateur.googleId = payload.sub;
      await utilisateur.save();

    }

    if (utilisateur.bloque) {
      return res.status(403).json({
        message: 'Ce compte a été bloqué'
      });
    }

    res.json({
      message: 'Connexion réussie',
      token: creerToken(utilisateur),
      user: utilisateur.versPublic()
    });

  } catch (error) {
    console.error('Erreur connexion Google :', error.message);

    res.status(401).json({
      message: 'Authentification Google impossible'
    });
  }
});

// Qui suis-je ? (le site s'en servira pour vérifier que le token est encore valable)
router.get('/me', verifyToken, function (req, res) {
  res.json({ user: req.user.versPublic() });
});

export default router;