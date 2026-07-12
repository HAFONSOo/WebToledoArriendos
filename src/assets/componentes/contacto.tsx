const Contacto = () => {
  const mapaEmbedSrc = "https://www.google.com/maps?q=-33.6121986,-70.7975046&z=15&output=embed";
  const mapaLink = "https://maps.app.goo.gl/xP4EUoL2LFJjVVeWA";

  return (
    <div className="bg-industrial-bg min-h-screen font-sans text-industrial-ink">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16">

        {/* Encabezado */}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-industrial-yellow bg-industrial-ink inline-block px-3 py-1 mb-4">
          Hablemos
        </span>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-none mb-4">
          Contacto
        </h1>
        <p className="text-industrial-ink/70 text-lg max-w-xl border-l-4 border-industrial-yellow pl-5 mb-12">
          ¿Necesitas cotizar un equipo o coordinar un retiro? Escríbenos y te respondemos
          el mismo día hábil.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Columna izquierda: datos de contacto, estilo placa */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-industrial-ink text-white p-6 border-t-4 border-industrial-yellow">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-1">Teléfono</p>
              <p className="font-display text-2xl mb-6">+569 5220 6431</p>

              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-1">Correo</p>
              <p className="font-display text-xl mb-6 break-all">mtoledovida79@gmail.com</p>

              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-1">Dirección</p>
              <p className="font-semibold">Camino Lonquén Norte, Paradero 14, El Acacio 50A, Calera de Tango</p>
            </div>

            <div className="border-2 border-industrial-ink/15 bg-white p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-industrial-ink/50 mb-3">Horario de atención</p>
              <div className="flex justify-between text-sm py-2 border-b border-industrial-ink/10">
                <span className="font-semibold">Lunes a domingo</span>
                <span className="font-mono text-industrial-ink/60">08:30 – 21:00</span>
                
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-industrial-ink/10">
                <span className="font-medium">Los despachos dependeran de la disponibilidad del flete</span>
                
                
              </div>
             
              
            </div>

            <a
              href="https://wa.me/56952206431"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-industrial-yellow border-2 border-industrial-ink px-6 py-4 font-bold uppercase tracking-wider text-sm hover:bg-industrial-ink hover:text-white transition-colors"
            >
              Escribir por WhatsApp
            </a>
          </div>

          {/* Columna derecha: ubicación en Google Maps */}
          <div className="lg:col-span-3 bg-white border-2 border-industrial-ink/15 flex flex-col overflow-hidden">
            <div className="p-6 md:p-8 pb-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-industrial-ink/50 mb-1">Encuéntranos</p>
                <p className="font-display text-2xl uppercase leading-none">Toledo Arriendos</p>
              </div>
              <a
                href={mapaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-industrial-ink text-white font-bold uppercase tracking-wider text-xs hover:bg-industrial-yellow hover:text-industrial-ink transition-colors"
              >
                Cómo llegar
              </a>
            </div>

            <div className="w-full aspect-[4/3] md:aspect-video border-t-2 border-industrial-ink/10">
              <iframe
                src={mapaEmbedSrc}
                title="Ubicación de Toledo Arriendos en Google Maps"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
