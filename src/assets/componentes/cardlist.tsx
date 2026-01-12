import React, { useEffect, useState } from "react";
import type { Productos } from "./card.type.ts";
import { getProductos } from "../services/weback.ts";
import '../style/cart.css';
export default function Cardlist() {
    const [Productos, setProductos] = useState<Productos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchProductos() {
        try {
            setLoading(true);
            const data = await getProductos();
            setProductos(data);
        } catch (err) {
            setError("Error al cargar los productos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductos();
    }, []);

    
    return (
        <div className='bg-gray-200 min-h-screen flex  justify-center items-start  gap-5 flex-wrap p-4 flexbox'>
            {Productos.map((producto) => (
                <div 
                    key={producto.id} 
                    className="w-60 p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl min-h-[380px] flex flex-col"
                >
                    <div className="flex flex-col items-center justify-center">
                        
                        <img 
                            src={producto.imagenURL ?? ''} 
                            className="h-40 w-full object-cover rounded-xl mb-2" 
                            alt='' 
                        />
                        <h1 className="font-bold text-l mb-2">{producto.nombre}</h1>
                    </div>

                    <h2 className=" text-m mb-">{producto.descripcion}</h2>
                    <p className='text-sm text-gray-600 mb-2'>${producto.precio} x dia</p>
                    <button 
                        className={`w-full px-1 py-2 rounded font-medium mt-auto  ${
                            producto.estado 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-gray-400 text-gray-700'
                        }`}
                    >
                        {producto.estado ? 'Disponible' : 'No Disponible'}
                    </button>
                </div>
            ))}
            
        </div>
    );
}