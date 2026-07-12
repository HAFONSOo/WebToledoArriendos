/**
 * Formatea un precio con separador de miles estilo chileno (punto), sin decimales.
 * Ej: formatPrecio(40000) -> "40.000"
 */
export function formatPrecio(precio: number | string | null | undefined): string {
  const valor = Number(precio ?? 0);
  if (Number.isNaN(valor)) return "0";
  return valor.toLocaleString("es-CL", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}
