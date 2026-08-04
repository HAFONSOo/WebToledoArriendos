export interface ProductoImagen {
    id: number
    url: string
    orden: number
}

export interface Productos {
    descripcion: string | null
    estado: boolean | null
    id: number
    imagenURL: string | null
    nombre: string
    precio: number | null
    cantidad: number | null
    idCategoria: number | null
    producto_imagenes?: ProductoImagen[]
    // Campo agregado al procesar
    categoriaNombre?: string
}