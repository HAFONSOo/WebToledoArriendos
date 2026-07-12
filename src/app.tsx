import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from "./assets/componentes/nav";
import Cardlist from "./assets/componentes/Cardlist";
import Contacto from "./assets/componentes/contacto";
import ProductoDetalle from "./assets/componentes/ProductoDetalle";
import { CartProvider } from "./assets/componentes/CartContext";

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-industrial-bg">
          {/* NavBar se muestra en todas las páginas */}
          <NavBar />

          {/* Definición de rutas */}
          <Routes>
            {/* Ruta principal - Catálogo */}
            <Route path="/" element={<Cardlist />} />

            {/* Ruta de contacto */}
            <Route path="/contacto" element={<Contacto />} />

            {/* Ruta para detalle de producto */}
            <Route path="/producto/:id" element={<ProductoDetalle />} />

            {/* Ruta para catálogo explícito */}
            <Route path="/catalogo" element={<Cardlist />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
