import axios from 'axios';

// Un SEUL endroit qui connaît l'adresse de l'API.
// En local : http://localhost:5000. En ligne : la variable VITE_API_URL (sans /api à la fin).
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'
});

// Avant chaque requête, on ajoute le token de connexion (s'il existe)
api.interceptors.request.use(function (config) {

  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
});

export default api;