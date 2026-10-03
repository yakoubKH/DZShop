import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUTS = ['En attente', 'Expédiée', 'Livrée', 'Annulée'];

function AdminCommandes() {

  const [commandes, setCommandes] = useState([]);
  const [erreur, setErreur] = useState('');

  function chargerCommandes() {
    api.get('/commandes')
      .then(function (res) { setCommandes(res.data); })
      .catch(function (err) {
        setErreur(err.response ? err.response.data.message : err.message);
      });
  }

  useEffect(function () {
    chargerCommandes();
  }, []);

  async function changerStatut(id, statut) {

    try {
      await api.patch('/commandes/' + id + '/statut', { statut });
      chargerCommandes();
    } catch (error) {
      setErreur(
        error.response ? error.response.data.message : 'Erreur serveur'
      );
    }

  }

  return (
    <div className="container py-5">

      <h1>Admin — Commandes</h1>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Produits</th>
            <th>Total</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map(function (commande) {
            return (
              <tr key={commande._id}>
                <td>{commande.client.nom}<br /><small className="text-muted">{commande.client.email}</small></td>
                <td>
                  {commande.produits.map(function (p) {
                    return p.nom + ' × ' + p.quantite;
                  }).join(', ')}
                </td>
                <td>{commande.total} DA</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={commande.statut}
                    onChange={function (e) { changerStatut(commande._id, e.target.value); }}
                  >
                    {STATUTS.map(function (s) {
                      return <option key={s} value={s}>{s}</option>;
                    })}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}

export default AdminCommandes;