import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Inscription
router.post('/register', async function (req, res) {
  try {
    const { nom, email, motDePasse } = req.body;

    // Vérifier les champs
    if (!nom || !email || !motDePasse) {
      return res.status(400).json({
        message: 'Tous les champs sont obligatoires'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExiste = await User.findOne({ email });

    if (utilisateurExiste) {
      return res.status(400).json({
        message: 'Cet email est déjà utilisé'
      });
    }

    // Chiffrer le mot de passe
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    // Créer l'utilisateur
    const utilisateur = await User.create({
      nom,
      email,
      motDePasse: motDePasseHash
    });

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email
      }
    });

  } catch (error) {
    console.error('Erreur inscription :', error);

    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

// تسجيل الدخول
router.post('/login', async function (req, res) {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }

    const utilisateur = await User.findOne({ email });

    if (!utilisateur) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    const motDePasseCorrect = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse
    );

    if (!motDePasseCorrect) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    const token = jwt.sign(
      {
        id: utilisateur._id,
        email: utilisateur.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      message: 'Connexion réussie',
      token: token,
      user: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email
      }
    });

  } catch (error) {
    console.error('Erreur connexion :', error);

    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

export default router;