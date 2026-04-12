import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BlenderWorkshop from './blender-workshop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BlenderWorkshop />
  </StrictMode>
)
