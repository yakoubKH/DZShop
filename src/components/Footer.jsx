function Footer() {
  // new Date().getFullYear() = l'année actuelle, jamais périmée
  const annee = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container text-center">
        <p className="mb-1">🛒 DZShop — Skikda, Algérie</p>
        <p className="text-secondary small mb-0">
          © {annee} — Tous droits réservés
        </p>
      </div>
    </footer>
  )
}

export default Footer