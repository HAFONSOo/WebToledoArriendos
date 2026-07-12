import React, { useState, useEffect } from "react";
// 1. Importamos useNavigate
import { Link, useNavigate } from "react-router-dom";
import type { Productos } from "./card.type"; // Ajusta si tu interfaz se llama "Producto" o "Productos"
import { getProductos } from "../services/weback";
import { formatPrecio } from "./format";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";

const NavBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [filtroProductos, setFiltroProductos] = useState<Productos[]>([]);
  const [allproductos, setAllproductos] = useState<Productos[]>([]);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [carritoAbierto, setCarritoAbierto] = useState<boolean>(false);
  const { totalItems } = useCart();

  // 2. Inicializamos useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await getProductos();
        const transformedData = data.map((producto: any) => ({
          ...producto,
          // Mantenemos el id como string para que coincida con tu interfaz
          id: String(producto.id),
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

  // Quita tildes/diacríticos y normaliza a minúsculas para comparar sin errores
  // por acentos (ej: "excavadora" encuentra "Excavadora" y "compresion" encuentra "Compresión")
  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Filtra con debounce: espera a que la persona deje de tipear antes de
  // recalcular, busca por nombre Y categoría, soporta varias palabras en
  // cualquier orden ("taladro inalambrico") y limita la lista a 8 resultados
  useEffect(() => {
    const queryNormalizada = normalizar(query);

    if (!queryNormalizada) {
      setFiltroProductos([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const terminos = queryNormalizada.split(/\s+/).filter(Boolean);

      const resultado = allproductos
        .filter((producto) => {
          const textoProducto = normalizar(`${producto.nombre} ${producto.categoriaNombre ?? ""}`);
          return terminos.every((termino) => textoProducto.includes(termino));
        })
        .slice(0, 8);

      setFiltroProductos(resultado);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query, allproductos]);

  // 3. Actualizamos la función de clic para navegar
  const handleProductoClick = (producto: Productos) => {
    setQuery(''); // Limpiamos el buscador en lugar de dejar el nombre
    setFiltroProductos([]); // Ocultamos los resultados
    setMenuAbierto(false); // Cerramos el menú móvil por si acaso
    navigate(`/producto/${producto.id}`); // Navegamos a la vista de detalle
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <nav className="bg-industrial-ink text-white shadow-lg sticky top-0 z-40 border-b-4 border-industrial-yellow font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <h1 className="font-display text-lg sm:text-xl uppercase leading-none whitespace-nowrap cursor-pointer transition-colors group-hover:text-industrial-yellow">
              Toledo <span className="text-industrial-yellow group-hover:text-white">Arriendos</span>
            </h1>
            <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Maquinaria &amp; equipos
            </span>
          </Link>

          {/* Buscador - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="¿Qué equipo buscas?"
                className="w-full pl-4 pr-10 py-2.5 bg-white text-industrial-ink placeholder-industrial-ink/40 text-sm font-medium border-2 border-transparent focus:outline-none focus:border-industrial-yellow transition-colors"
                disabled={loading}
              />
              {loading ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-industrial-ink/30 border-t-industrial-ink rounded-full"></div>
                </div>
              ) : (
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-industrial-ink/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>

            {/* Resultados de búsqueda */}
            {filtroProductos.length > 0 && (
              <ul className="absolute top-full mt-2 w-full bg-white text-industrial-ink shadow-xl max-h-96 overflow-y-auto z-50 border-2 border-industrial-ink/15">
                {filtroProductos.map((producto) => (
                  <li
                    key={producto.id}
                    onClick={() => handleProductoClick(producto)}
                    className="px-4 py-3 hover:bg-industrial-yellow/10 cursor-pointer border-b border-industrial-ink/10 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {producto.imagenURL && (
                        <img
                          src={producto.imagenURL}
                          alt={producto.nombre}
                          className="w-12 h-12 object-contain bg-industrial-bg border border-industrial-ink/10"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-industrial-ink">{producto.nombre}</p>
                        {producto.precio && (
                          <p className="font-mono text-xs text-industrial-ink/50">${formatPrecio(producto.precio)} / día</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                        producto.estado
                          ? 'text-green-700'
                          : 'text-industrial-ink/40'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${producto.estado ? 'bg-green-500' : 'bg-industrial-ink/20'}`}></span>
                        {producto.estado ? 'Disponible' : 'No disp.'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Mensaje cuando no hay resultados */}
            {query && filtroProductos.length === 0 && !loading && (
              <div className="absolute top-full mt-2 w-full bg-white text-industrial-ink shadow-xl p-4 z-50 border-2 border-industrial-ink/15">
                <p className="text-center font-mono text-xs uppercase tracking-widest text-industrial-ink/40">Sin resultados</p>
              </div>
            )}
          </div>

          {/* Links de navegación - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 hover:text-industrial-yellow transition-colors"
            >
              Catálogo
            </Link>
            <Link
              to="/contacto"
              className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 hover:text-industrial-yellow transition-colors"
            >
              Contacto
            </Link>
            <a
              href="#feedback"
              className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 hover:text-industrial-yellow transition-colors"
            >
              Feedback
            </a>
          </div>

          {/* Carrito (siempre visible) */}
          <button
            onClick={() => setCarritoAbierto(true)}
            aria-label="Ver carrito"
            className="relative p-2 hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-industrial-yellow text-industrial-ink text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-industrial-ink">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón menú hamburguesa - Mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-industrial-yellow"
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
        <div className="md:hidden border-t border-white/10 bg-industrial-ink">
          <div className="px-4 py-4 space-y-4">
            {/* Buscador móvil */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="¿Qué equipo buscas?"
                  className="w-full pl-4 pr-10 py-2.5 bg-white text-industrial-ink placeholder-industrial-ink/40 text-sm font-medium border-2 border-transparent focus:outline-none focus:border-industrial-yellow"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-industrial-ink/30 border-t-industrial-ink rounded-full"></div>
                  </div>
                )}
              </div>

              {filtroProductos.length > 0 && (
                <ul className="mt-2 bg-white text-industrial-ink shadow-xl max-h-64 overflow-y-auto border-2 border-industrial-ink/15">
                  {filtroProductos.map((producto) => (
                    <li
                      key={producto.id}
                      onClick={() => handleProductoClick(producto)}
                      className="px-4 py-3 hover:bg-industrial-yellow/10 cursor-pointer border-b border-industrial-ink/10 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {producto.imagenURL && (
                          <img
                            src={producto.imagenURL}
                            alt={producto.nombre}
                            className="w-10 h-10 object-contain bg-industrial-bg border border-industrial-ink/10"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-industrial-ink text-sm">{producto.nombre}</p>
                          {producto.precio && (
                            <p className="font-mono text-xs text-industrial-ink/50">${formatPrecio(producto.precio)} / día</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {query && filtroProductos.length === 0 && !loading && (
                <div className="mt-2 bg-white text-industrial-ink shadow-xl p-3 border-2 border-industrial-ink/15">
                  <p className="text-center font-mono text-xs uppercase tracking-widest text-industrial-ink/40">Sin resultados</p>
                </div>
              )}
            </div>

            {/* Links móvil */}
            <div className="flex flex-col space-y-1 pt-2 border-t border-white/10">
              <Link
                to="/"
                onClick={cerrarMenu}
                className="block px-3 py-3 hover:bg-white/5 transition-colors font-mono text-xs uppercase tracking-[0.2em] text-white/80"
              >
                Catálogo
              </Link>
              <Link
                to="/contacto"
                onClick={cerrarMenu}
                className="block px-3 py-3 hover:bg-white/5 transition-colors font-mono text-xs uppercase tracking-[0.2em] text-white/80"
              >
                Contacto
              </Link>
              <a
                href="#feedback"
                onClick={cerrarMenu}
                className="block px-3 py-3 hover:bg-white/5 transition-colors font-mono text-xs uppercase tracking-[0.2em] text-white/80"
              >
                Feedback
              </a>
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={carritoAbierto} onClose={() => setCarritoAbierto(false)} />
    </nav>
  );
};

export default NavBar;
