import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function AdminUtilisateurs() {

  const { user: moi } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [erreur, setErreur] = useState('');

  function chargerUtilisateurs() {
    api.get('/utilisateurs')
      .then(function (res) { setUtilisateurs(res.data); })
      .catch(function (err) {
        setErreur(err.response ? err.response.data.message : err.message);
      });
  }

  useEffect(function () {
    chargerUtilisateurs();
  }, []);

  async function changerRole(id, roleActuel) {

    const nouveauRole = roleActuel === 'admin' ? 'client' : 'admin';

    try {
      await api.patch('/utilisateurs/' + id + '/role', { role: nouveauRole });
      chargerUtilisateurs();
    } catch (error) {
      setErreur(
        error.response ? error.response.data.message : 'Erreur serveur'
      );
    }

  }

  async function changerBlocage(id, bloqueActuellement) {

    try {
      await api.patch('/utilisateurs/' + id + '/bloquer', { bloque: !bloqueActuellement });
      chargerUtilisateurs();
    } catch (error) {
      setErreur(
        error.response ? error.response.data.message : 'Erreur serveur'
      );
    }

  }

  return (
    <div className="container py-5">

      <h1>Admin — Utilisateurs</h1>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="alert alert-info">
        💡 Tu ne peux pas changer ton propre rôle ni te bloquer toi-même : les boutons sont
        désactivés sur ta propre ligne (et l'API le refuserait de toute façon).
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Connexion</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(function (u) {

            // On compare avec l'id de l'admin connecté : c'est LE garde-fou côté écran
            // (l'API refuse de toute façon, mais on évite d'afficher un bouton inutile)
            const estMoi = moi && String(moi.id) === String(u.id);

            return (
              <tr key={u.id}>
                <td>{u.nom}{estMoi && ' (toi)'}</td>
                <td>{u.email}</td>
                <td>{u.provider === 'google' ? 'Google' : 'Email'}</td>
                <td>{u.role}</td>
                <td>{u.bloque ? 'Bloqué' : 'Actif'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    disabled={estMoi}
                    onClick={function () { changerRole(u.id, u.role); }}
                  >
                    {u.role === 'admin' ? 'Retirer admin' : 'Rendre admin'}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={estMoi}
                    onClick={function () { changerBlocage(u.id, u.bloque); }}
                  >
                    {u.bloque ? 'Débloquer' : 'Bloquer'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}

export default AdminUtilisateurs;