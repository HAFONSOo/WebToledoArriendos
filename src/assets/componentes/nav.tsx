import React, { useState, useEffect } from "react";
import type { Productos } from "./card.type.ts";
import { getProductos } from "../services/weback.ts";

const NavBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [filtroProductos, setFilttroProductos] = useState<Productos[]>([]);
  const [allproductos, setAllproductos] = useState<Productos[]>([]);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setAllproductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };
    fetchProductos();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    
    if (value === '') {
      setFilttroProductos([]);
    } else {
      const resultado = allproductos.filter((producto) =>
        producto.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFilttroProductos(resultado);
    }
  };

  return (
    
    <div className=" display-flex flex flex-wrap justify-center p-4 bg-gray-800 text-white ">
      <h1>
        Toledo Arriendos
      </h1>
      <input 
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder='Que Buscas?'
        className=""
      />
      <ul className=" border-0">
        {filtroProductos.map((producto) => (
          <button >
          
          <li key={producto.id}>{producto.nombre}
          </li>
          </button>
        ))}
      </ul>
    </div>
  );
};

export default NavBar;