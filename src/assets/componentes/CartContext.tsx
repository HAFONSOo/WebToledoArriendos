import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Productos } from "./card.type";
import type { CartItem } from "./cart.types";

interface CartContextType {
  items: CartItem[];
  addToCart: (producto: Productos, cantidad?: number) => void;
  removeFromCart: (id: number) => void;
  updateCantidad: (id: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrecio: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "toledo-arriendos-carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage no disponible (modo privado, etc.) — el carrito sigue funcionando en memoria
    }
  }, [items]);

  function addToCart(producto: Productos, cantidad: number = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...prev, { producto, cantidad }];
    });
  }

  function removeFromCart(id: number) {
    setItems((prev) => prev.filter((i) => i.producto.id !== id));
  }

  function updateCantidad(id: number, cantidad: number) {
    if (cantidad <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.producto.id === id ? { ...i, cantidad } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
  const totalPrecio = items.reduce((acc, i) => acc + Number(i.producto.precio || 0) * i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateCantidad, clearCart, totalItems, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de un <CartProvider>");
  return ctx;
}
