import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// verifyToken = "qui es-tu ?"  (401 si on ne sait pas)
export async function verifyToken(req, res, next) {

  const entete = req.headers.authorization || '';
  const token = entete.startsWith('Bearer ') ? entete.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Connexion requise' });
  }

  try {

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // On relit l'utilisateur en base à chaque requête :
    // si son rôle change, c'est pris en compte tout de suite.
    const utilisateur = await User.findById(decode.id);

    if (!utilisateur) {
      return res.status(401).json({ message: 'Compte introuvable' });
    }

    req.user = utilisateur;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

// isAdmin = "as-tu le droit ?"  (403 si non). À placer APRÈS verifyToken.
export function isAdmin(req, res, next) {

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès réservé à l'admin" });
  }

  next();
}