import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // Au chargement, on relit ce qui a été sauvegardé (localStorage) : ça évite
  // de devoir se reconnecter à chaque F5.
  const [user, setUser] = useState(function () {
    const sauvegarde = localStorage.getItem('dzshop_user');
    return sauvegarde ? JSON.parse(sauvegarde) : null;
  });

  function sauvegarderSession(token, utilisateur) {
    localStorage.setItem('token', token);
    localStorage.setItem('dzshop_user', JSON.stringify(utilisateur));
    setUser(utilisateur);
  }

  // Connexion classique (email + mot de passe)
  async function login(email, motDePasse) {
    const res = await api.post('/auth/login', { email, motDePasse });
    sauvegarderSession(res.data.token, res.data.user);
  }

  // Inscription
  async function register(nom, email, motDePasse) {
    const res = await api.post('/auth/register', { nom, email, motDePasse });
    sauvegarderSession(res.data.token, res.data.user);
  }

  // Connexion avec Google : "credential" est le jeton signé par Google
  // (fourni par window.google.accounts.id, voir LoginPage.jsx)
  async function loginGoogle(credential) {
    const res = await api.post('/auth/google', { credential });
    sauvegarderSession(res.data.token, res.data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('dzshop_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}