import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';

function AdminStats() {

  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(function () {
    api.get('/stats')
      .then(function (res) { setStats(res.data); })
      .catch(function (err) {
        setErreur(err.response ? err.response.data.message : err.message);
      });
  }, []);

  if (erreur) return <div className="container py-5"><div className="alert alert-danger">{erreur}</div></div>;
  if (!stats) return <div className="container py-5">Chargement...</div>;

  return (
    <div className="container py-5">

      <h1>Admin — Statistiques</h1>

      <div className="row g-3 my-3">

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <div className="fs-4 fw-bold">{stats.chiffreAffaires} DA</div>
            <div className="text-muted">Chiffre d'affaires (livrées)</div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <div className="fs-4 fw-bold">{stats.nbCommandes}</div>
            <div className="text-muted">Commandes</div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <div className="fs-4 fw-bold">{stats.nbProduits}</div>
            <div className="text-muted">Produits</div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <div className="fs-4 fw-bold">{stats.nbUtilisateurs}</div>
            <div className="text-muted">Utilisateurs</div>
          </div>
        </div>

      </div>

      <h2 className="mt-5">Ventes des 7 derniers jours</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={stats.ventes7j}>
            <XAxis dataKey="jour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ventes" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="mt-5">Top produits (les plus vendus)</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité vendue</th>
            <th>Chiffre d'affaires</th>
          </tr>
        </thead>
        <tbody>
          {stats.topProduits.map(function (p) {
            return (
              <tr key={p._id}>
                <td>{p.nom}</td>
                <td>{p.quantite}</td>
                <td>{p.chiffreAffaires} DA</td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}

export default AdminStats;