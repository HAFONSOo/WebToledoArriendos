import { useCart } from "./CartContext";
import { buildWhatsappMensajeCarrito } from "./cart.utils";

// Local fallback for formatting price to avoid missing-module errors.
function formatPrecio(value: number | string | null | undefined): string {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "0";
  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, clearCart, totalPrecio } = useCart();

  const whatsappLink = items.length > 0 ? buildWhatsappMensajeCarrito(items) : "#";

  return (
    <>
      {/* Fondo oscuro */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-industrial-ink/50 z-40 transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-industrial-bg z-50 shadow-2xl flex flex-col font-sans text-industrial-ink transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Encabezado */}
        <div className="bg-industrial-ink text-white px-6 py-5 flex items-center justify-between border-b-4 border-industrial-yellow">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">Tu solicitud</p>
            <h2 className="font-display text-2xl uppercase leading-none">Carrito</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="p-2 hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-industrial-ink/40 mb-2">Vacío</span>
              <p className="text-industrial-ink/60 max-w-[220px]">
                Aún no agregas equipos. Vuelve al catálogo y súmalos a tu solicitud.
              </p>
            </div>
          ) : (
            <ul>
              {items.map(({ producto, cantidad }) => {
                
                return (
                  <li
                    key={producto.id}
                    className="flex gap-4 px-6 py-5 border-b border-industrial-ink/10"
                  >
                    <img
                      src={producto.imagenURL || "/placeholder.png"}
                      alt={producto.nombre}
                      className="w-20 h-20 object-contain bg-white border-2 border-industrial-ink/15 p-1 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/100x100?text=Sin+Imagen";
                      }}
                    />

                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm leading-tight line-clamp-2">{producto.nombre}</p>
                        <button
                          onClick={() => removeFromCart(producto.id)}
                          aria-label={`Quitar ${producto.nombre}`}
                          className="shrink-0 text-industrial-ink/30 hover:text-industrial-red transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <p className="font-mono text-xs text-industrial-ink/50 mb-3">
                        {formatPrecio(producto.precio)} / día c/u
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border-2 border-industrial-ink/15">
                          
                         
                        </div>
                        <span className="font-display text-lg">
                          ${formatPrecio(Number(producto.precio || 0) * cantidad)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Resumen y checkout */}
        {items.length > 0 && (
          <div className="border-t-2 border-industrial-ink/15 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-industrial-ink/50">
                Total / día
              </span>
              <span className="font-display text-3xl">${formatPrecio(totalPrecio)}</span>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-full py-4 bg-industrial-ink text-white font-bold uppercase tracking-wider text-sm hover:bg-industrial-yellow hover:text-industrial-ink transition-colors mb-3"
            >
              Reservar por WhatsApp
            </a>

            <button
              onClick={clearCart}
              className="w-full text-center font-mono text-xs uppercase tracking-[0.2em] text-industrial-ink/40 hover:text-industrial-red transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
