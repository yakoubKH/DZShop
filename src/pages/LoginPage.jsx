import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./deco.css";
function LoginPage() {

  const { login, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const boutonGoogle = useRef(null);

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  // Connexion classique
  async function valider(e) {

    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      await login(email, motDePasse);
      navigate('/');
    } catch (error) {
      setErreur(
        error.response ? error.response.data.message : 'Impossible de contacter le serveur.'
      );
    } finally {
      setChargement(false);
    }

  }

  // Affiche le vrai bouton Google (fourni par le script chargé dans index.html)
  useEffect(function () {

    if (!window.google || !boutonGoogle.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async function (reponse) {
        try {
          await loginGoogle(reponse.credential);
          navigate('/');
        } catch (error) {
          setErreur('Connexion Google impossible.');
        }
      }
    });

    window.google.accounts.id.renderButton(boutonGoogle.current, {
      theme: 'outline',
      size: 'large',
      width: 300
    });

  }, [loginGoogle, navigate]);

  return (
    <div className='back'>
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <div className='login-container'>
      <h1>Connexion</h1>

      {erreur && (
        <div className="alert alert-danger mt-3">{erreur}</div>
      )}
       
      <form onSubmit={valider} className="mt-4">

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
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={motDePasse}
            onChange={function (e) { setMotDePasse(e.target.value); }}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={chargement}>
          {chargement ? 'Connexion...' : 'Se connecter'}
        </button>

      </form>
      

      <div className="text-center my-3">— ou —</div>

      {/* Google remplace ce div par son propre bouton */}
      <div ref={boutonGoogle}></div>

      <p className="mt-4">
        Pas encore de compte ? <Link to="/register">Créer un compte</Link>
      </p>
   </div>
    </div>
    </div>
  );
}

export default LoginPage;