import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Productos } from "./card.type"; 
import { getProductos } from "../services/weback";

export default function ProductoDetalle() {
    const { id } = useParams<{ id: string }>(); 
    
    const [producto, setProducto] = useState<Productos | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducto() {
            try {
                setLoading(true);
                const data = await getProductos();
                
                // CORRECCIÓN: Forzamos ambos IDs a String para asegurar que coincidan sin importar cómo vengan de la BD
                const productoEncontrado = data.find((p: any) => String(p.id) === String(id));

                if (productoEncontrado) {
                    const productoFormateado: Productos = {
                        ...productoEncontrado,
                        id: Number(productoEncontrado.id),
                        estado: productoEncontrado.estado === 'true' || productoEncontrado.estado === true
                    };
                    setProducto(productoFormateado);
                } else {
                    setError("Producto no encontrado");
                }
            } catch (err) {
                setError("Error al cargar los detalles del producto");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProducto();
        }
    }, [id]);

    if (loading) return <div className="text-center p-10">Cargando detalles...</div>;
    if (error || !producto) return <div className="text-center p-10 text-red-500">{error || "Producto no encontrado"}</div>;

    return (
        <div className="bg-gray-200 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-block mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    &larr; Volver al catálogo
                </Link>

                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl flex flex-col md:flex-row gap-10">
                    {/* Columna de Imagen */}
                    <div className="w-full md:w-1/2">
                        <img 
                            src={producto.imagenURL || '/placeholder.png'} 
                            alt={producto.nombre} 
                            className="w-full h-auto object-contain rounded-xl shadow-md border border-gray-100"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Sin+Imagen'; }}
                        />
                    </div>

                    {/* Columna de Detalles */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
                        
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            {producto.descripcion}
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Precio de arriendo</p>
                            <p className="text-4xl font-bold text-purple-600">${producto.precio} <span className="text-lg text-gray-500 font-normal">/ día</span></p>
                        </div>

                        <div className="flex items-center gap-4 mt-auto">
                            <span className={`px-4 py-2 rounded-lg font-bold ${
                                producto.estado 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                                {producto.estado ? "Disponible" : "No disponible"}
                            </span>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}