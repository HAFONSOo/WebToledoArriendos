import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Productos } from "./card.type";
import { getProductos } from "../services/weback";

export default function ProductoDetalle() {
    const { id } = useParams<{ id: string }>();

    const [producto, setProducto] = useState<Productos | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        async function fetchProducto() {
            try {
                setLoading(true);
                const data = await getProductos();

                // CORRECCIÓN: Forzamos ambos IDs a String para asegurar que coincidan sin importar cómo vengan de la BD
                const productoEncontrado = data.find((p: any) => String(p.id) === String(id));

                if (productoEncontrado) {
                    const estadoBooleano = typeof productoEncontrado.estado === 'boolean'
                        ? productoEncontrado.estado
                        : String(productoEncontrado.estado).toLowerCase() === 'true';

                    const productoFormateado: Productos = {
                        ...productoEncontrado,
                        id: Number(productoEncontrado.id),
                        idCategoria: Number(productoEncontrado.idCategoria),
                        estado: estadoBooleano
                    };
                    setProducto(productoFormateado);
                } else {
                    setError("Producto no encontrado");
                }
            } catch (err) {
                setError("Error al cargar los detalles del producto");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProducto();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-industrial-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-industrial-ink border-t-industrial-yellow rounded-full animate-spin"></div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-industrial-ink/60">Cargando ficha técnica…</p>
                </div>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-industrial-bg p-6">
                <div className="text-center max-w-sm">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-industrial-red mb-3">Error 404 · Equipo</p>
                    <p className="text-2xl font-black uppercase text-industrial-ink mb-6">{error || "Producto no encontrado"}</p>
                    <Link to="/" className="inline-flex items-center px-6 py-3 bg-industrial-ink text-white font-bold uppercase tracking-wider text-sm hover:bg-industrial-yellow hover:text-industrial-ink transition-colors">
                        &larr; Volver al catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const whatsappNumero = "56952206431";
    const whatsappMensaje = `Hola, quiero arrendar el equipo "${producto.nombre}"). ¿Está disponible?`;
    const whatsappLink = `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(whatsappMensaje)}`;

    return (
        <div className="bg-industrial-bg min-h-screen w-full font-sans text-industrial-ink pb-28 md:pb-0">
            {/* Fuentes: agrégalas una vez en tu index.html o vía @import global,
                no hace falta repetirlas en cada componente. Ver tailwind.config.js
                para el mapeo font-display / font-mono / font-sans. */}
            <style>{`
                .rivet { position: absolute; width: 8px; height: 8px; border-radius: 9999px; background: radial-gradient(circle at 35% 30%, #9a9488, #5b564c); }
            `}</style>

            {/* Barra superior: breadcrumb */}
            <div className="w-full border-b-2 border-industrial-ink/10 bg-industrial-bg/95 backdrop-blur sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
                    <Link to="/" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-industrial-ink/70 hover:text-industrial-ink transition-colors">
                        <span className="inline-block transition-transform group-hover:-translate-x-1">&larr;</span>
                        Catálogo
                    </Link>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-industrial-ink/40">
                        Ficha N.º {String(producto.id).padStart(4, '0')}
                    </span>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-10 lg:gap-16 px-6 md:px-10 pt-8 md:pt-12">

                {/* Columna Izquierda: Imagen */}
                <div className="w-full lg:w-1/2">
                    <div className="relative bg-white border-2 border-industrial-ink/15 aspect-square flex items-center justify-center overflow-hidden group">
                        {/* Remaches decorativos en las esquinas, estilo placa de maquinaria */}
                        <span className="rivet" style={{ top: 10, left: 10 }}></span>
                        <span className="rivet" style={{ top: 10, right: 10 }}></span>
                        <span className="rivet" style={{ bottom: 10, left: 10 }}></span>
                        <span className="rivet" style={{ bottom: 10, right: 10 }}></span>

                        {!imgLoaded && (
                            <div className="absolute inset-0 animate-pulse bg-industrial-ink/5"></div>
                        )}
                        <img
                            src={producto.imagenURL || '/placeholder.png'}
                            alt={producto.nombre}
                            onLoad={() => setImgLoaded(true)}
                            className="max-w-[80%] max-h-[80%] object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Sin+Imagen'; }}
                        />

                        <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] bg-industrial-ink text-white px-2 py-1">
                            Vista 01/01
                        </span>
                    </div>

                    {/* Placa técnica estilo maquinaria */}
                    <div className="mt-4 bg-industrial-ink text-white px-5 py-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest relative">
                        <span className="rivet" style={{ top: '50%', left: 8, transform: 'translateY(-50%)' }}></span>
                        <span className="rivet" style={{ top: '50%', right: 8, transform: 'translateY(-50%)' }}></span>
                        <div className="flex flex-col gap-1 pl-3">
                            <span className="text-white/40">Categoría</span>
                            <span className="text-industrial-yellow">#{producto.idCategoria}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-white/40">Código</span>
                            <span>{String(producto.id).padStart(4, '0')}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-end pr-3">
                            <span className="text-white/40">Estado</span>
                            <span className={producto.estado ? "text-green-400" : "text-red-400"}>
                                {producto.estado ? "Operativo" : "Fuera línea"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Detalles */}
                <div className="w-full lg:w-1/2 flex flex-col">

                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-industrial-yellow bg-industrial-ink inline-block w-fit px-3 py-1 mb-4">
                        Equipo de arriendo
                    </span>

                    <h1 className="font-display text-4xl md:text-6xl leading-[0.95] uppercase mb-6">
                        {producto.nombre}
                    </h1>

                    <p className="text-industrial-ink/75 text-lg leading-relaxed border-l-4 border-industrial-yellow pl-5 mb-8">
                        {producto.descripcion}
                    </p>

                    {/* Precio y disponibilidad */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="bg-industrial-yellow border-2 border-industrial-ink px-6 py-5 flex-1">
                            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-industrial-ink/70 mb-1">Valor de arriendo</p>
                            <p className="font-display text-4xl md:text-5xl">
                                ${producto.precio}
                                <span className="text-base font-sans font-semibold align-middle ml-1">/ día</span>
                            </p>
                        </div>

                        <div className="border-2 border-industrial-ink/15 px-6 py-5 flex flex-col justify-center gap-2 sm:w-56">
                            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-industrial-ink/50">Disponibilidad</span>
                            <span className="inline-flex items-center gap-2 font-bold uppercase text-sm">
                                <span className={`w-2.5 h-2.5 rounded-full ${producto.estado ? "bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]" : "bg-red-600 shadow-[0_0_0_4px_rgba(220,38,38,0.15)]"}`}></span>
                                {producto.estado ? "Disponible ahora" : "No disponible"}
                            </span>
                        </div>
                    </div>

                    {/* CTA principal (desktop) */}
                    {producto.estado ? (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hidden md:inline-flex w-full items-center justify-center gap-3 py-5 font-bold uppercase tracking-[0.15em] text-sm transition-colors mb-10 bg-industrial-ink text-white hover:bg-industrial-yellow hover:text-industrial-ink"
                        >
                            Reservar por WhatsApp
                        </a>
                    ) : (
                        <button
                            disabled
                            className="hidden md:inline-flex w-full items-center justify-center gap-3 py-5 font-bold uppercase tracking-[0.15em] text-sm mb-10 bg-industrial-ink/10 text-industrial-ink/40 cursor-not-allowed"
                        >
                            Equipo no disponible
                        </button>
                    )}

                    {/* QR estilo etiqueta de bodega: escanea y cae directo al chat de WhatsApp */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-auto flex items-center gap-4 border-t-2 border-dashed border-industrial-ink/20 pt-6 hover:border-industrial-yellow transition-colors"
                    >
                        <div className="bg-white border-2 border-industrial-ink/15 p-2 shrink-0 group-hover:border-industrial-yellow transition-colors">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(whatsappLink)}`}
                                alt={`Escanear para reservar ${producto.nombre} por WhatsApp`}
                                className="w-24 h-24 object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-industrial-ink/50">Etiqueta digital</span>
                            <span className="font-semibold text-sm max-w-[220px] group-hover:text-industrial-ink">
                                Escanea o toca el código para reservar este equipo por WhatsApp
                            </span>
                        </div>
                    </a>
                </div>
            </div>

            {/* Barra inferior fija (mobile) */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-industrial-ink text-white px-5 py-4 flex items-center justify-between z-30 border-t-4 border-industrial-yellow">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Por día</p>
                    <p className="font-display text-2xl">${producto.precio}</p>
                </div>
                {producto.estado ? (
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 font-bold uppercase tracking-wider text-sm bg-industrial-yellow text-industrial-ink"
                    >
                        Reservar
                    </a>
                ) : (
                    <button disabled className="px-6 py-3 font-bold uppercase tracking-wider text-sm bg-white/10 text-white/30">
                        No disponible
                    </button>
                )}
            </div>
        </div>
    );
}
