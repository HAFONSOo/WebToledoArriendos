import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import Cardlist from './assets/componentes/cardlist.tsx'
import NavBar from './assets/componentes/nav.tsx' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
    <NavBar/>
    <Cardlist />
    </>
  </StrictMode>,
)
