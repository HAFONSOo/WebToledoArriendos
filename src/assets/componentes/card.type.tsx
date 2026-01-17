export interface Productos {
    descripcion: string | null
    estado: boolean | null
    id: number
    imagenURL: string | null
    nombre: string
    precio: number | null
    cantidad: number | null
    idCategoria: number | null
    // Campo agregado al procesar
    categoriaNombre?: string
}