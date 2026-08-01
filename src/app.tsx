import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from "./assets/componentes/nav";
import Cardlist from "./assets/componentes/Carrito/Cardlist";
import Contacto from "./assets/componentes/contacto";
import ProductoDetalle from "./assets/componentes/ProductoDetalle";
import Login from "./assets/componentes/Login/login";
import { CartProvider } from "./assets/componentes/Carrito/CartContext";
import RutaAdmin from "./assets/componentes/Admin/RutaAdmin";
import PanelAdmin from "./assets/componentes/Admin/PanelAdmin";

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
            <Route path="/login" element={<Login />} />

            {/* Ruta de contacto */}
            <Route path="/contacto" element={<Contacto />} />

            {/* Ruta para detalle de producto */}
            <Route path="/producto/:id" element={<ProductoDetalle />} />

            {/* Ruta para catálogo explícito */}
            <Route path="/catalogo" element={<Cardlist />} />
            <Route 
              path="/admin" 
              element={
                <RutaAdmin>
                  <PanelAdmin />
                </RutaAdmin>
              } 
            />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
