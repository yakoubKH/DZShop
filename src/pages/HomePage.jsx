
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            Bienvenue chez DZShop
          </span>

          <h1 className="hero-title">
            La technologie
            <span> à portée de main</span>
          </h1>

          <p className="hero-description">
            Découvrez notre sélection de produits électroniques
            et trouvez les équipements adaptés à vos besoins,
            partout en Algérie.
          </p>

          <div className="hero-actions">
            <Link
              className="btn-modern btn-modern-primary"
              to="/products"
            >
              Découvrir les produits →
            </Link>

            <a
              className="btn-modern btn-modern-outline"
              href="#avantages"
            >
              Pourquoi DZShop ?
            </a>
          </div>

          <div className="hero-benefits">
            <div className="hero-benefit">
              <strong>Qualité</strong>
              <span>Produits sélectionnés</span>
            </div>

            <div className="hero-benefit">
              <strong>Choix</strong>
              <span>Plusieurs catégories</span>
            </div>

            <div className="hero-benefit">
              <strong>DZ</strong>
              <span>Une boutique en Algérie</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-circle">
            <div className="hero-device">
              <div className="device-screen">
                <span>DZ</span>
                <strong>SHOP</strong>
                <small>TECHNOLOGIE</small>
              </div>
            </div>

            <div className="hero-floating-card">
              <span>✦</span>
              <div>
                <strong>Votre univers tech</strong>
                <small>Tout au même endroit</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-intro" id="avantages">
        <div className="section-heading">
          <h2>Pourquoi choisir DZShop ?</h2>
          <p>
            Une expérience d'achat simple pour découvrir
            vos produits électroniques préférés.
          </p>
        </div>

        <div className="home-features">
          <article className="feature-card">
            <span className="feature-icon">⌕</span>
            <h3>Explorez</h3>
            <p>
              Parcourez notre catalogue et recherchez
              facilement les produits qui vous intéressent.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">▣</span>
            <h3>Choisissez</h3>
            <p>
              Consultez les informations et les prix
              des produits disponibles.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">🛒</span>
            <h3>Commandez</h3>
            <p>
              Ajoutez vos articles au panier et préparez
              votre commande en quelques étapes.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default HomePage
