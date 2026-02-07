import  { useEffect, useState } from "react";
import type { Productos } from "./card.type";
import { getProductos } from "../services/weback";

export default function Cardlist() {
    const [productos, setProductos] = useState<Productos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("todas");
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>("todos");

    async function fetchProductos() {
        try {
            setLoading(true);
            setError(null);
            const data = await getProductos();
           
            const transformedData = (data || []).map(producto => ({
                ...producto,
                id: typeof producto.id === 'string' ? parseInt(producto.id, 10) : producto.id,
                idCategoria: typeof producto.idCategoria === 'string' ? parseInt(producto.idCategoria, 10) : producto.idCategoria,
                estado: typeof producto.estado === 'string' ? producto.estado === "true" : !!producto.estado
            }));
            setProductos(transformedData as Productos[]);
        } catch (err) {
            console.error("Error completo:", err);
            setError("Error al cargar los productos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductos();
    }, []);

    // Obtener categorías únicas (filtrar null y undefined)
    const categorias = ["todas", ...new Set(
        productos
            .map(p => p.categoriaNombre)
            .filter((cat): cat is string => cat !== null && cat !== undefined && cat !== "" && cat !== "Sin categoría")
    )];

    // Filtrar productos por categoría y disponibilidad
    const productosFiltrados = productos.filter(producto => {
        // Filtro por categoría
        const categoriaProducto = producto.categoriaNombre || "";
        const cumpleCategoria = categoriaSeleccionada === "todas" || categoriaProducto === categoriaSeleccionada;
        
        // Filtro por disponibilidad
        let cumpleDisponibilidad = true;
        const cantidadProducto = producto.cantidad ?? 0;
        if (filtroDisponibilidad === "disponibles") {
            cumpleDisponibilidad = cantidadProducto > 0;
        } else if (filtroDisponibilidad === "agotados") {
            cumpleDisponibilidad = cantidadProducto === 0;
        }
        
        return cumpleCategoria && cumpleDisponibilidad;
    });

    if (loading) {
        return (
            <div className="bg-gray-200 min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-200 min-h-screen flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={fetchProductos}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="bg-gray-200 min-h-screen flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-gray-600">No hay productos disponibles</p>
                </div>
            </div>
        );
    }
    
    return ( 
        <div className="bg-gray-200 min-h-screen p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Barra de filtros */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Productos
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Filtro por categoría */}
                            <div className="flex items-center gap-2">
                                <label className="text-gray-700 font-medium text-sm">Categoría:</label>
                                <select 
                                    value={categoriaSeleccionada}
                                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                                >
                                    {categorias.map((categoria) => (
                                        <option key={categoria} value={categoria}>
                                            {categoria === "todas" ? "Todas" : categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por disponibilidad */}
                            <div className="flex items-center gap-2">
                                <label className="text-gray-700 font-medium text-sm">Disponibilidad:</label>
                                <select 
                                    value={filtroDisponibilidad}
                                    onChange={(e) => setFiltroDisponibilidad(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="disponibles">Con stock</option>
                                    <option value="agotados">Agotados</option>
                                </select>
                            </div>

                            {/* Botón para limpiar filtros */}
                            {(categoriaSeleccionada !== "todas" || filtroDisponibilidad !== "todos") && (
                                <button
                                    onClick={() => {
                                        setCategoriaSeleccionada("todas");
                                        setFiltroDisponibilidad("todos");
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Contador de resultados */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">
                            Mostrando <span className="font-bold text-purple-600">{productosFiltrados.length}</span> de <span className="font-bold">{productos.length}</span> productos
                            {categoriaSeleccionada !== "todas" && <span className="text-purple-600"> en {categoriaSeleccionada}</span>}
                            {filtroDisponibilidad !== "todos" && <span className="text-purple-600"> ({filtroDisponibilidad})</span>}
                        </p>
                    </div>
                </div>

                {/* Grid de productos */}
                {productosFiltrados.length === 0 ? (
                    <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                        <p className="text-gray-600 text-lg">No hay productos que coincidan con los filtros seleccionados</p>
                        <button
                            onClick={() => {
                                setCategoriaSeleccionada("todas");
                                setFiltroDisponibilidad("todos");
                            }}
                            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productosFiltrados.map((producto) => (
                            <div 
                                key={producto.id} 
                                className="w-full max-w-sm mx-auto p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl min-h-[450px] flex flex-col"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    {/* Badge de stock */}
                                    <div className="relative w-full">
                                        <img 
                                            src={producto.imagenURL || '/placeholder.png'} 
                                            className="h-56 w-full object-cover rounded-xl mb-3" 
                                            alt={producto.nombre}
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                                            }}
                                        />
                                        {(producto.cantidad ?? 0) === 0 && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                AGOTADO
                                            </div>
                                        )}
                                        
                                    </div>
                                    
                                    <h1 className="font-bold text-xl mb-3 text-center">{producto.nombre}</h1>
                                    
                                    {/* Badge de categoría */}
                                    {producto.categoriaNombre && producto.categoriaNombre !== "Sin categoría" && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium mb-2">
                                            {producto.categoriaNombre}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-base text-gray-700 mb-3">{producto.descripcion}</h2>
                                <p className="text-lg text-gray-800 mb-3">
                                    Stock: <span className={`font-bold ${(producto.cantidad ?? 0) === 0 ? 'text-red-500' : (producto.cantidad ?? 0) <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                                        {producto.cantidad ?? 0} unidades
                                    </span>
                                </p>
                                <p className="text-lg text-gray-800 mb-3 font-bold">${producto.precio} x día</p>
                                
                                <button 
                                    className={`w-full px-2 py-3 rounded-lg font-semibold text-base mt-auto transition-colors ${
                                        producto.estado && (producto.cantidad ?? 0) > 0
                                            ? 'bg-green-500 text-white hover:bg-green-600' 
                                            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    }`}
                                    disabled={!producto.estado || (producto.cantidad ?? 0) === 0}
                                >
                                    {(producto.cantidad ?? 0) === 0 ? 'Agotado' : producto.estado ? 'Disponible' : 'No Disponible'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}