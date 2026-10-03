import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {

  const { register } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function valider(e) {

    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      await register(nom, email, motDePasse);
      navigate('/');
    } catch (error) {
      setErreur(
        error.response ? error.response.data.message : 'Impossible de contacter le serveur.'
      );
    } finally {
      setChargement(false);
    }

  }

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>

      <h1>Créer un compte</h1>

      {erreur && (
        <div className="alert alert-danger mt-3">{erreur}</div>
      )}

      <form onSubmit={valider} className="mt-4">

        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={function (e) { setNom(e.target.value); }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={function (e) { setEmail(e.target.value); }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mot de passe (6 caractères minimum)</label>
          <input
            type="password"
            className="form-control"
            value={motDePasse}
            onChange={function (e) { setMotDePasse(e.target.value); }}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={chargement}>
          {chargement ? 'Création...' : 'Créer mon compte'}
        </button>

      </form>

      <p className="mt-4">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>

    </div>
  );
}

export default RegisterPage;