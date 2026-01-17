import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from "./assets/componentes/nav.tsx";
import Cardlist from "./assets/componentes/cardlist.tsx";
import Contacto from "./assets/componentes/contacto.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-200">
        {/* NavBar se muestra en todas las páginas */}
        <NavBar />
        
        {/* Definición de rutas */}
        <Routes>
          {/* Ruta principal - Catálogo */}
          <Route path="/" element={<Cardlist />} />
          
          {/* Ruta de contacto */}
          <Route path="/contacto" element={<Contacto />} />
          
          {/* Ruta para catálogo explícito */}
          <Route path="/catalogo" element={<Cardlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;