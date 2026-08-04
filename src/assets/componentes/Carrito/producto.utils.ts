import type { Productos } from "./card.type";

/**
 * Devuelve la URL de la imagen principal de un producto.
 * Prioridad:
 *   1. La primera imagen no vacía en producto_imagenes (tabla nueva, orden asc)
 *   2. El campo legado imagenURL (por compatibilidad con productos viejos)
 *   3. Un placeholder local
 */
export function getImagenPrincipal(producto: Productos): string {
  const imagenGaleria = producto.producto_imagenes?.find((img) => img.url?.trim())?.url;
  return imagenGaleria || producto.imagenURL || "/placeholder.png";
}
