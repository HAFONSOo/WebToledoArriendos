import type { CartItem } from "./cart.types";
// Local implementation of formatPrecio to avoid missing module './format'
function formatPrecio(value: number): string {
  // Format number with thousands separator (dot) and no decimals
  const rounded = Math.round(value);
  return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const WHATSAPP_NUMERO = "56952206431";

/**
 * Arma el link de WhatsApp con un mensaje que lista todos los productos
 * del carrito, su cantidad, subtotal y el total estimado del arriendo.
 */
export function buildWhatsappMensajeCarrito(items: CartItem[]): string {
  const lineas = items.map((item, idx) => {
    const subtotal = Number(item.producto.precio || 0) * item.cantidad;
    return `${idx + 1}. ${item.producto.nombre} — x${item.cantidad} — $${formatPrecio(subtotal)}`;
  });

  const total = items.reduce(
    (acc, item) => acc + Number(item.producto.precio || 0) * item.cantidad,
    0
  );

  const mensaje = [
    "Hola, quiero arrendar los siguientes equipos:",
    "",
    ...lineas,
    "",
    `Total estimado: $${formatPrecio(total)} / día`,
    "",
    "¿Están disponibles?",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
