import { useEffect, useState } from 'react';
import api from '../../api/axios';

const PRODUIT_VIDE = { nom: '', prix: '', categorie: '', stock: '', chemin: '' };

function AdminProduits() {

  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState(PRODUIT_VIDE);
  const [idEnEdition, setIdEnEdition] = useState(null);
  const [erreur, setErreur] = useState('');

  function chargerProduits() {
    api.get('/produits')
      .then(function (res) { setProduits(res.data); })
      .catch(function (err) { setErreur(err.message); });
  }

  useEffect(function () {
    chargerProduits();
  }, []);

  function modifierChamp(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function commencerEdition(produit) {
    setIdEnEdition(produit._id);
    setForm({
      nom: produit.nom,
      prix: produit.prix,
      categorie: produit.categorie,
      stock: produit.stock,
      chemin: produit.chemin
    });
  }

  function annulerEdition() {
    setIdEnEdition(null);
    setForm(PRODUIT_VIDE);
  }

  async function valider(e) {

    e.preventDefault();
    setErreur('');

    const donnees = {
      nom: form.nom,
      prix: Number(form.prix),
      categorie: form.categorie,
      stock: Number(form.stock),
      chemin: form.chemin
    };

    try {

      if (idEnEdition) {
        await api.put('/produits/' + idEnEdition, donnees);
      } else {
        await api.post('/produits', donnees);
      }

      annulerEdition();
      chargerProduits();

    } catch (error) {
      setErreur(
        error.response ? error.response.data.message : 'Erreur serveur'
      );
    }

  }

  async function supprimer(id) {

    if (!window.confirm('Supprimer ce produit ?')) return;

    try {
      await api.delete('/produits/' + id);
      chargerProduits();
    } catch (error) {
      setErreur(
        error.response ? error.response.data.message : 'Erreur serveur'
      );
    }

  }

  return (
    <div className="container py-5">

      <h1>Admin — Produits</h1>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <form onSubmit={valider} className="row g-2 my-4 align-items-end">

        <div className="col-md-3">
          <label className="form-label">Nom</label>
          <input name="nom" className="form-control" value={form.nom} onChange={modifierChamp} required />
        </div>

        <div className="col-md-2">
          <label className="form-label">Prix (DA)</label>
          <input name="prix" type="number" className="form-control" value={form.prix} onChange={modifierChamp} required />
        </div>

        <div className="col-md-2">
          <label className="form-label">Catégorie</label>
          <input name="categorie" className="form-control" value={form.categorie} onChange={modifierChamp} required />
        </div>

        <div className="col-md-2">
          <label className="form-label">Stock</label>
          <input name="stock" type="number" className="form-control" value={form.stock} onChange={modifierChamp} required />
        </div>

        <div className="col-md-3">
          <label className="form-label">Image (chemin)</label>
          <input name="chemin" className="form-control" value={form.chemin} onChange={modifierChamp} required placeholder="/images/1.jpg" />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {idEnEdition ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </button>
          {idEnEdition && (
            <button type="button" className="btn btn-outline-secondary ms-2" onClick={annulerEdition}>
              Annuler
            </button>
          )}
        </div>

      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Catégorie</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {produits.map(function (produit) {
            return (
              <tr key={produit._id}>
                <td>{produit.nom}</td>
                <td>{produit.prix} DA</td>
                <td>{produit.categorie}</td>
                <td>{produit.stock}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={function () { commencerEdition(produit); }}>
                    Modifier
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={function () { supprimer(produit._id); }}>
                    Supprimer
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

export default AdminProduits;