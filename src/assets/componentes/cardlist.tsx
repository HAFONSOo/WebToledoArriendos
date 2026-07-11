import { useEffect, useState } from "react";
import type { Productos } from "./card.type";
import { getProductos } from "../services/weback";
import { Link } from "react-router-dom";

export default function Cardlist() {
    const [productos, setProductos] = useState<Productos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de filtros y orden
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("todas");
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>("todos");
    // MODIFICADO: El estado inicial ahora es 'mayor-menor'
    const [ordenPrecio, setOrdenPrecio] = useState<string>("mayor-menor");

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

    // 1. Filtrar productos por categoría y disponibilidad
    let productosFiltrados = productos.filter(producto => {
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

    // 2. Ordenar los productos filtrados por precio
    if (ordenPrecio === "mayor-menor") {
        productosFiltrados.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0));
    } else if (ordenPrecio === "menor-mayor") {
        productosFiltrados.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0));
    }

    const huboFiltros = categoriaSeleccionada !== "todas" || filtroDisponibilidad !== "todos" || ordenPrecio !== "mayor-menor";
    const limpiarFiltros = () => {
        setCategoriaSeleccionada("todas");
        setFiltroDisponibilidad("todos");
        setOrdenPrecio("mayor-menor");
    };

    if (loading) {
        return (
            <div className="bg-industrial-bg min-h-screen flex justify-center items-center font-sans">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-industrial-ink border-t-industrial-yellow rounded-full mx-auto mb-4"></div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-industrial-ink/60">Cargando catálogo…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-industrial-bg min-h-screen flex justify-center items-center font-sans p-6">
                <div className="text-center bg-white border-2 border-industrial-ink/15 p-8 max-w-sm">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-industrial-red mb-3">Error de carga</p>
                    <p className="text-industrial-ink mb-6">{error}</p>
                    <button
                        onClick={fetchProductos}
                        className="px-6 py-3 bg-industrial-ink text-white font-bold uppercase tracking-wider text-sm hover:bg-industrial-yellow hover:text-industrial-ink transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="bg-industrial-bg min-h-screen flex justify-center items-center font-sans p-6">
                <div className="text-center bg-white border-2 border-industrial-ink/15 p-8">
                    <p className="text-industrial-ink/60">No hay productos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-industrial-bg min-h-screen font-sans text-industrial-ink">
            <div className="max-w-[1400px] mx-auto p-6">

                {/* Encabezado */}
                <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.3em] text-industrial-yellow bg-industrial-ink inline-block px-3 py-1 mb-3">
                            Catálogo de arriendo
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl uppercase leading-none">
                            Equipos disponibles
                        </h1>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-industrial-ink/40">
                        {productosFiltrados.length} de {productos.length} equipos
                    </span>
                </div>

                {/* Barra de filtros */}
                <div className="bg-white border-2 border-industrial-ink/15 p-5 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex flex-wrap items-center gap-4">

                            {/* Selector de Orden de Precio */}
                            <div className="flex items-center gap-2">
                                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-industrial-ink/50">Ordenar</label>
                                <select
                                    value={ordenPrecio}
                                    onChange={(e) => setOrdenPrecio(e.target.value)}
                                    className="px-4 py-2 border-2 border-industrial-ink/15 bg-white text-industrial-ink font-semibold text-sm hover:border-industrial-yellow focus:outline-none focus:ring-2 focus:ring-industrial-yellow focus:border-transparent transition-all cursor-pointer"
                                >
                                    <option value="mayor-menor">Precio: mayor a menor</option>
                                    <option value="menor-mayor">Precio: menor a mayor</option>
                                </select>
                            </div>

                            {/* Filtro por disponibilidad */}
                            <div className="flex items-center gap-2">
                                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-industrial-ink/50">Stock</label>
                                <select
                                    value={filtroDisponibilidad}
                                    onChange={(e) => setFiltroDisponibilidad(e.target.value)}
                                    className="px-4 py-2 border-2 border-industrial-ink/15 bg-white text-industrial-ink font-semibold text-sm hover:border-industrial-yellow focus:outline-none focus:ring-2 focus:ring-industrial-yellow focus:border-transparent transition-all cursor-pointer"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="disponibles">Con stock</option>
                                    <option value="agotados">Agotados</option>
                                </select>
                            </div>

                            {huboFiltros && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="px-4 py-2 border-2 border-industrial-ink/15 text-industrial-ink/60 hover:border-industrial-ink hover:text-industrial-ink transition-colors text-sm font-semibold uppercase tracking-wide"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Categorías como Botones */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-dashed border-industrial-ink/10">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                onClick={() => setCategoriaSeleccionada(categoria)}
                                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-150 border-2 ${
                                    categoriaSeleccionada === categoria
                                        ? "bg-industrial-yellow text-industrial-ink border-industrial-ink"
                                        : "bg-transparent text-industrial-ink/60 border-industrial-ink/10 hover:border-industrial-ink/40 hover:text-industrial-ink"
                                }`}
                            >
                                {categoria === "todas" ? "Todas" : categoria}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de productos */}
                {productosFiltrados.length === 0 ? (
                    <div className="text-center bg-white border-2 border-industrial-ink/15 p-10">
                        <p className="text-industrial-ink/60 text-lg mb-4">No hay productos que coincidan con los filtros seleccionados</p>
                        <button
                            onClick={limpiarFiltros}
                            className="px-6 py-3 bg-industrial-ink text-white font-bold uppercase tracking-wider text-sm hover:bg-industrial-yellow hover:text-industrial-ink transition-colors"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productosFiltrados.map((producto) => {
                            const agotado = (producto.cantidad ?? 0) === 0;
                            const disponible = producto.estado && !agotado;

                            return (
                                <Link
                                    to={`/producto/${producto.id}`}
                                    key={producto.id}
                                    className="group w-full bg-white border-2 border-industrial-ink/15 hover:border-industrial-ink transition-colors duration-200 flex flex-col cursor-pointer"
                                >
                                    {/* Imagen */}
                                    <div className="relative w-full aspect-square bg-industrial-bg overflow-hidden border-b-2 border-industrial-ink/15">
                                        <img
                                            src={producto.imagenURL || '/placeholder.png'}
                                            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                            alt={producto.nombre}
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                                            }}
                                        />
                                        {agotado && (
                                            <div className="absolute top-3 right-3 bg-industrial-red text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                                                Agotado
                                            </div>
                                        )}
                                        {producto.categoriaNombre && producto.categoriaNombre !== "Sin categoría" && (
                                            <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] bg-industrial-ink text-white px-2 py-1">
                                                {producto.categoriaNombre}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h2 className="font-display text-lg uppercase leading-tight mb-3 line-clamp-2">
                                            {producto.nombre}
                                        </h2>

                                        <div className="flex items-baseline justify-between mb-4">
                                            <span className="font-display text-2xl text-industrial-ink">
                                                ${producto.precio}
                                            </span>
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-industrial-ink/40">/ día</span>
                                        </div>

                                        <div
                                            className={`mt-auto w-full text-center px-2 py-3 font-mono text-xs font-bold uppercase tracking-widest border-2 flex items-center justify-center gap-2 ${
                                                disponible
                                                    ? "bg-white text-industrial-ink border-industrial-ink group-hover:bg-industrial-yellow"
                                                    : "bg-industrial-ink/5 text-industrial-ink/40 border-industrial-ink/10"
                                            }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${disponible ? "bg-green-500" : "bg-industrial-ink/20"}`}></span>
                                            {agotado ? 'Agotado' : producto.estado ? 'Ver detalles' : 'No disponible'}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
