import React, { useEffect, useState } from "react";
import type { Productos } from "./card.type";
import { getProductos } from "../services/weback";

export default function Cardlist() {
    const [productos, setProductos] = useState<Productos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchProductos() {
        try {
            setLoading(true);
            setError(null);
            const data = await getProductos();
            console.log("Productos obtenidos:", data); // Debug
            setProductos(data || []);
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
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map((producto) => (
                    <div 
                        key={producto.id} 
                        className="w-full max-w-sm mx-auto p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl min-h-[450px] flex flex-col"
                    >
                    <div className="flex flex-col items-center justify-center">
                        <img 
                            src={producto.imagenURL || '/placeholder.png'} 
                            className="h-56 w-full object-cover rounded-xl mb-3" 
                            alt={producto.nombre}
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                            }}
                        />
                        <h1 className="font-bold text-xl mb-3 text-center">{producto.nombre}</h1>
                    </div>

                    <h2 className="text-base text-gray-700 mb-3 flex-grow">{producto.descripcion}</h2>
                    <p className="text-lg text-gray-800 mb-3 font-bold">${producto.precio} x día</p>
                    <button 
                        className={`w-full px-2 py-3 rounded-lg font-semibold text-base mt-auto transition-colors ${
                            producto.estado 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        }`}
                        disabled={!producto.estado}
                    >
                        {producto.estado ? 'Disponible' : 'No Disponible'}
                    </button>
                </div>
            ))}
            </div>
        </div>
    );
}