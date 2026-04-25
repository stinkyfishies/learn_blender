import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BlenderWorkshop from './src/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BlenderWorkshop />
  </StrictMode>
)
