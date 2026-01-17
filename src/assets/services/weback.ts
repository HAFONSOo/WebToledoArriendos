import supabase from "../services/supabaseClient";

async function getProductos() {
  // Solo obtener productos primero
  const { data: productos, error: errorProductos } = await supabase
    .from("Productos")
    .select("id, nombre, descripcion, precio, cantidad, estado, imagenURL, idCategoria");
 
  if (errorProductos) {
    console.error("Error productos:", errorProductos);
    throw errorProductos;
  }



  // Obtener categorías
  const { data: categorias, error: errorCategorias } = await supabase
    .from("Categoria")
    .select("idCategoria, categoria");
  
  if (errorCategorias) {
    console.error("❌ Error categorías:", errorCategorias);
    // Devolver sin categorías
    return productos.map(p => ({ ...p, categoriaNombre: "Sin categoría" }));
  }

 
  
  // Mapear categorías
  const catMap = {};
  categorias.forEach(c => {
    catMap[c.idCategoria] = c.categoria;
  });

 
  
  // Combinar
  const resultado = productos.map(p => ({
    ...p,
    categoriaNombre: catMap[p.idCategoria] || "Sin categoría"
  }));


  
  return resultado;
}

export { getProductos };