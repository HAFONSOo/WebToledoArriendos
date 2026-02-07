import supabase from "../services/supabaseClient";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  estado: string;
  imagenURL: string;
  idCategoria: string;
}

interface Categoria {
  idCategoria: string;
  categoria: string;
}

async function getProductos() {
  // Solo obtener productos primero
  const { data: productos, error: errorProductos } = await supabase
    .from("Productos")
    .select("id, nombre, descripcion, precio, cantidad, estado, imagenURL, idCategoria") as { data: Producto[] | null; error: any };
 
  if (errorProductos) {
    console.error("Error productos:", errorProductos);
    throw errorProductos;
  }



  // Obtener categorías
  const { data: categorias, error: errorCategorias } = await supabase
    .from("Categoria")
    .select("idCategoria, categoria") as { data: Categoria[] | null; error: any };
  
  if (errorCategorias) {
    console.error(" Error categorías:", errorCategorias);
    // Devolver sin categorías
    return (productos || []).map(p => ({ ...p, categoriaNombre: "Sin categoría" }));
  }

 
  
  // Mapear categorías
  const catMap: { [key: string]: string } = {};
  (categorias || []).forEach(c => {
    catMap[c.idCategoria] = c.categoria;
  });

 
  
  // Combinar
  const resultado = (productos || []).map(p => ({
    ...p,
    categoriaNombre: catMap[p.idCategoria] || "Sin categoría"
  }));


  
  return resultado;
}

export { getProductos };