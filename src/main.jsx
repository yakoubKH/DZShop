import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Le DESIGN de Bootstrap (boutons, cards, grille...)
import 'bootstrap/dist/css/bootstrap.min.css'

// Le JAVASCRIPT de Bootstrap : tout ce qui BOUGE (menu, modal...)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)