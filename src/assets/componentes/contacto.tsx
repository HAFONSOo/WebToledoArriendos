import { useState } from "react";

const Contacto = () => {
  const [form, setForm] = useState({ nombre: "", telefono: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar con el servicio de envío real (email / backend)
    setEnviado(true);
  };

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
              <p className="font-semibold">Camino lonquen norte,Paradero 14,el acacio 50a ,Calera de tango</p>
            </div>

            <div className="border-2 border-industrial-ink/15 bg-white p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-industrial-ink/50 mb-3">Horario de atención</p>
              <div className="flex justify-between text-sm py-2 border-b border-industrial-ink/10">
                <span className="font-semibold">Lunes a viernes</span>
                <span className="font-mono text-industrial-ink/60">08:30 – 18:30</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-industrial-ink/10">
                <span className="font-semibold">Sábado</span>
                <span className="font-mono text-industrial-ink/60">09:00 – 14:00</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="font-semibold">Domingo</span>
                <span className="font-mono text-industrial-ink/40">Cerrado</span>
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

          {/* Columna derecha: formulario */}
          <div className="lg:col-span-3 bg-white border-2 border-industrial-ink/15 p-6 md:p-8">
            {enviado ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <span className="w-3 h-3 rounded-full bg-green-500 mb-4"></span>
                <p className="font-display text-2xl uppercase mb-2">Mensaje enviado</p>
                <p className="text-industrial-ink/60 max-w-xs">
                  Gracias, {form.nombre || "cliente"}. Nuestro equipo te contactará a la brevedad.
                </p>
                <button
                  onClick={() => { setEnviado(false); setForm({ nombre: "", telefono: "", mensaje: "" }); }}
                  className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-industrial-ink/50 hover:text-industrial-ink underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-industrial-ink/50 block mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 border-2 border-industrial-ink/15 focus:outline-none focus:border-industrial-yellow transition-colors bg-industrial-bg"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-industrial-ink/50 block mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                    placeholder="+56 9 0000 0000"
                    className="w-full px-4 py-3 border-2 border-industrial-ink/15 focus:outline-none focus:border-industrial-yellow transition-colors bg-industrial-bg"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-industrial-ink/50 block mb-2">
                    ¿Qué equipo necesitas?
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Cuéntanos qué equipo, por cuántos días y desde cuándo lo necesitas"
                    className="w-full px-4 py-3 border-2 border-industrial-ink/15 focus:outline-none focus:border-industrial-yellow transition-colors bg-industrial-bg resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-industrial-ink text-white py-4 font-bold uppercase tracking-wider text-sm hover:bg-industrial-yellow hover:text-industrial-ink transition-colors"
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
