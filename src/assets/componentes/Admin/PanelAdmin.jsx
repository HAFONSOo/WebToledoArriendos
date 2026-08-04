import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabaseClient';

const PanelAdmin = () => {
const[productos,setProductos]=useState([])


useEffect(()=>{
  const fetchProductos=async()=>{
    const {data,error}=await supabase.from('Productos').select('*, producto_imagenes(id,url,orden)').order('orden',{referencedTable:'producto_imagenes'});
    if(error){
      console.error('Error al obtener los productos:', error);
    } else{
      setProductos(data);
    }
  };
  fetchProductos();
},[])
return (

    <div className="p-4">
  <div className="flex justify-end mb-4">
    <button
      type="submit"
      className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 cursor-pointer"
    >
      Agregar Nuevo Producto
    </button>
  </div>

  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
    {productos.map((producto) => (
      <li
        key={producto.id}
        className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-bold">{producto.nombre}</h3>
        <p className="text-sm text-gray-600">{producto.descripcion}</p>
        <p className="text-sm text-green-600 font-bold">${producto.precio}</p>
        <div className="flex gap-2 overflow-x-auto mt-2">
          {producto.producto_imagenes.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt=""
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
            />
          ))}
        </div>
        <button className="self-end mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md">
          actualizar
        </button>
        <button className="self-end mt-2 bg-red-500 text-white px-3 py-1 rounded-md">
          eliminar
        </button>
      </li>
    ))}
  </ul>
</div>
);
}
export default PanelAdmin;
