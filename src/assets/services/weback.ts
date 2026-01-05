
import supabase from "../services/supabaseClient";
async function getProductos() {
  const { data, error } = await supabase.from("Productos").select("*");
 
  if (error) throw error;
  return data;
  
}
export { getProductos };