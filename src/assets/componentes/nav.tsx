import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Productos } from "./card.type";
import { getProductos } from "../services/weback";

const NavBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [filtroProductos, setFiltroProductos] = useState<Productos[]>([]);
  const [allproductos, setAllproductos] = useState<Productos[]>([]);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await getProductos();
        const transformedData = data.map((producto: any) => ({
          ...producto,
          id: typeof producto.id === 'string' ? parseInt(producto.id, 10) : producto.id,
          idCategoria: typeof producto.idCategoria === 'string' ? parseInt(producto.idCategoria, 10) : producto.idCategoria,
          estado: producto.estado === 'true' || producto.estado === true
        }));
        setAllproductos(transformedData as Productos[]);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    
    if (value === '') {
      setFiltroProductos([]);
    } else {
      const resultado = allproductos.filter((producto) =>
        producto.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFiltroProductos(resultado);
    }
  };

  const handleProductoClick = (producto: Productos) => {
    setQuery(producto.nombre);
    setFiltroProductos([]);
    // Aquí puedes agregar navegación o scroll al producto
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <nav className="bg-gray-500 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap cursor-pointer hover:text-purple-200 transition-colors">
              Toledo Arriendos
            </h1>
          </Link>

          {/* Buscador - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative bg-white rounded-lg shadow-sm">
            <div className="relative w-full">
              <input 
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="¿Qué buscas?"
                className="w-full px-4 py-2 pr-10 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-shadow"
                disabled={loading}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Resultados de búsqueda */}
            {filtroProductos.length > 0 && (
              <ul className="absolute top-full mt-2 w-full bg-white text-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 border border-gray-200">
                {filtroProductos.map((producto) => (
                  <li 
                    key={producto.id}
                    onClick={() => handleProductoClick(producto)}
                    className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {producto.imagenURL && (
                        <img 
                          src={producto.imagenURL} 
                          alt={producto.nombre}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{producto.nombre}</p>
                        {producto.precio && (
                          <p className="text-sm text-gray-600">${producto.precio} x día</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        producto.estado 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {producto.estado ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Mensaje cuando no hay resultados */}
            {query && filtroProductos.length === 0 && !loading && (
              <div className="absolute top-full mt-2 w-full bg-white text-gray-800 rounded-lg shadow-xl p-4 z-50 border border-gray-200">
                <p className="text-center text-gray-500">No se encontraron productos</p>
              </div>
            )}
          </div>

          {/* Links de navegación - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="hover:text-purple-200 transition-colors font-medium"
            >
              Catálogo
            </Link>
            <Link 
              to="/contacto" 
              className="hover:text-purple-200 transition-colors font-medium"
            >
              Contacto
            </Link>
            <a 
              href="#feedback" 
              className="hover:text-purple-200 transition-colors font-medium"
            >
              Feedback
            </a>
          </div>

          {/* Botón menú hamburguesa - Mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Menú de navegación"
            aria-expanded={menuAbierto}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {menuAbierto ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t border-gray-600 bg-gray-700">
          <div className="px-4 py-3 space-y-3">
            {/* Buscador móvil */}
            <div className="relative">
              <div className="relative">
                <input 
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="¿Qué buscas?"
                  className="w-full px-4 py-2 pr-10 rounded-lg text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {filtroProductos.length > 0 && (
                <ul className="mt-2 bg-white text-gray-800 rounded-lg shadow-xl max-h-64 overflow-y-auto border border-gray-200">
                  {filtroProductos.map((producto) => (
                    <li 
                      key={producto.id}
                      onClick={() => {
                        handleProductoClick(producto);
                        cerrarMenu();
                      }}
                      className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {producto.imagenURL && (
                          <img 
                            src={producto.imagenURL} 
                            alt={producto.nombre}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{producto.nombre}</p>
                          {producto.precio && (
                            <p className="text-xs text-gray-600">${producto.precio} x día</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {query && filtroProductos.length === 0 && !loading && (
                <div className="mt-2 bg-white text-gray-800 rounded-lg shadow-xl p-3 border border-gray-200">
                  <p className="text-center text-gray-500 text-sm">No se encontraron productos</p>
                </div>
              )}
            </div>

            {/* Links móvil */}
            <div className="flex flex-col space-y-2 pt-2">
              <Link 
                to="/" 
                onClick={cerrarMenu}
                className="block px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Catálogo
              </Link>
              <Link 
                to="/contacto" 
                onClick={cerrarMenu}
                className="block px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Contacto
              </Link>
              <a 
                href="#feedback" 
                onClick={cerrarMenu}
                className="block px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Feedback
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;