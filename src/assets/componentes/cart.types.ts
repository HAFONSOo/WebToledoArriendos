import type { Productos } from "./card.type";

export interface CartItem {
  producto: Productos;
  cantidad: number;
}
