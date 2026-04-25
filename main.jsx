import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import BlenderWorkshop from './src/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <BlenderWorkshop />
    </HashRouter>
  </StrictMode>
)
