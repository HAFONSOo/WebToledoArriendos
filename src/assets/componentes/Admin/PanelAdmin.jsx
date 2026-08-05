import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabaseClient';

const PanelAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);

  const fetchProductos = useCallback(async () => {
    const { data, error } = await supabase
      .from('Productos')
      .select('*, producto_imagenes(id,url,orden), Categoria(idCategoria,categoria)')
      .order('orden', { referencedTable: 'producto_imagenes' });

    if (error) {
      console.error('Error al obtener los productos:', error);
    } else {
      setProductos(data);
    }
  }, []);

  const fetchCategorias = useCallback(async () => {
    const { data, error } = await supabase
      .from('Categoria')
      .select('idCategoria, categoria')
      .order('categoria');

    if (error) {
      console.error('Error al obtener las categorías:', error);
    } else {
      setCategorias(data);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos, fetchCategorias]);

const alternarEstadoProducto = async (producto) => {
    setCargando(true);
    const nuevoEstado = !producto.estado;
    
    const { error } = await supabase
      .from('Productos')
      .update({ estado: nuevoEstado })
      .eq('id', producto.id);

    if (error) {
      alert('Error al cambiar el estado: ' + error.message);
    } else {
      fetchProductos(); // Recargamos para ver el cambio
    }
    setCargando(false);
  };

  const eliminarProducto = async (productoId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto por completo? Esta acción no se puede deshacer.')) return;
    
    setCargando(true);

    const { error } = await supabase
      .from('Productos')
      .delete()
      .eq('id', productoId);

    if (error) {
      alert('Error al eliminar el producto: ' + error.message);
    } else {
      fetchProductos(); // Recargamos la lista para que desaparezca
    }
    
    setCargando(false);
  };


  const eliminarImagen = async (imgId, imgUrl) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) return;
    setCargando(true);

    // 1. Borrar de la base de datos
    const { error: dbError } = await supabase
      .from('producto_imagenes')
      .delete()
      .eq('id', imgId);

    if (dbError) {
      alert('Error al borrar la imagen de la base de datos: ' + dbError.message);
      setCargando(false);
      return;
    }

    // 2. Intentar borrar del Storage (Bucket)
    try {
      // Extraemos la ruta final después de "/imagenes/"
      const urlParts = imgUrl.split('/imagenes/');
      if (urlParts.length > 1) {
        const rutaStorage = urlParts[1];
        await supabase.storage.from('imagenes').remove([rutaStorage]);
      }
    } catch (e) {
      console.error('Nota: Se borró de la BD, pero hubo un problema en el Storage', e);
    }

    fetchProductos(); // Recargamos la lista
    setCargando(false);
  };

  // Sube un arreglo de archivos al bucket 'imagenes' y crea sus registros en producto_imagenes
  const subirImagenes = async (archivos, productoId) => {
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      const rutaArchivo = `${productoId}/${Date.now()}-${archivo.name}`;

      const { error: errorUpload } = await supabase.storage
        .from('imagenes')
        .upload(rutaArchivo, archivo);

      if (errorUpload) {
        console.error('Error al subir imagen:', errorUpload);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('imagenes')
        .getPublicUrl(rutaArchivo);

      const { error: errorImagen } = await supabase
        .from('producto_imagenes')
        .insert({
          producto_id: productoId,
          url: urlData.publicUrl,
          orden: i,
        });

      if (errorImagen) {
        console.error('Error al guardar referencia de imagen:', errorImagen);
      }
    }
  };

  const manejarInsert = async (e) => {
    e.preventDefault();
    setCargando(true);

    const formdata = new FormData(e.target);
    const nombre = formdata.get('nombre');
    const descripcion = formdata.get('descripcion');
    const precio = Number(formdata.get('precio'));
    const cantidad=1
    const idCategoria = formdata.get('idCategoria');
    const archivos = formdata.getAll('imagenes').filter((f) => f.size > 0);

    const { data: nuevoProducto, error: errorInsert } = await supabase
      .from('Productos')
      .insert({ nombre, precio, descripcion, estado: true, idCategoria,cantidad })
      .select()
      .single();

    if (errorInsert) {
      alert('Error al crear el producto: ' + errorInsert.message);
      setCargando(false);
      return;
    }

    if (archivos.length > 0) {
      await subirImagenes(archivos, nuevoProducto.id);
    }

    setCargando(false);
    alert('Producto creado correctamente');
    e.target.reset();
    fetchProductos();
  };

  const manejarActualizacion = async (e, producto) => {
    e.preventDefault();
    setCargando(true);

    const formData = new FormData(e.target);
    const nombre = (formData.get('nombre') || '').toString().trim();
    const descripcion = (formData.get('descripcion') || '').toString().trim();
    const precio = (formData.get('precio') || '').toString().trim();
    const idCategoria = (formData.get('idCategoria') || '').toString().trim();
    const archivos = formData.getAll('imagenes').filter((f) => f.size > 0);

    const datosAActualizar = {};
    if (nombre !== '') datosAActualizar.nombre = nombre;
    if (descripcion !== '') datosAActualizar.descripcion = descripcion;
    if (precio !== '') datosAActualizar.precio = precio;
    if (idCategoria !== '') datosAActualizar.idCategoria = idCategoria;

    if (Object.keys(datosAActualizar).length === 0 && archivos.length === 0) {
      alert('Escribe algo o adjunta una imagen para actualizar.');
      setCargando(false);
      return;
    }

    if (Object.keys(datosAActualizar).length > 0) {
      const { error } = await supabase
        .from('Productos')
        .update(datosAActualizar)
        .eq('id', producto.id);

      if (error) {
        alert('Error al actualizar el producto: ' + error.message);
        setCargando(false);
        return;
      }
    }

    if (archivos.length > 0) {
      await subirImagenes(archivos, producto.id);
    }

    setCargando(false);
    alert('Producto actualizado correctamente');
    e.target.reset();
    fetchProductos();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

      {/* Formulario: Agregar producto */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nuevo Producto</h2>
        <form onSubmit={manejarInsert} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la máquina"
              required
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Precio</label>
            <input
              type="number"
              name="precio"
              placeholder="0"
              required
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción del producto"
              required
              rows={3}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Categoría</label>
            <select
              name="idCategoria"
              required
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Imágenes</label>
            <input
              type="file"
              name="imagenes"
              multiple
              accept="image/*"
              className="border border-gray-300 rounded-lg p-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-yellow-500 file:text-white file:font-semibold hover:file:bg-yellow-600 file:cursor-pointer cursor-pointer"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {cargando ? 'Guardando...' : 'Agregar Nuevo Producto'}
            </button>
          </div>
        </form>
      </div>

      {/* Listado de productos */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((producto) => (
          <li
            key={producto.id}
            className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
          >
            {/* CARRUSEL DE IMÁGENES CON BOTÓN X */}
            <div className="flex gap-3 overflow-x-auto p-4 bg-gray-50 border-b border-gray-100">
              {producto.producto_imagenes.length > 0 ? (
                producto.producto_imagenes.map((img) => (
                  <div key={img.id} className="relative flex-shrink-0 mt-2">
                    <img
                      src={img.url}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarImagen(img.id, img.url)}
                      disabled={cargando}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shadow-md hover:bg-red-700 transition-colors"
                      title="Eliminar imagen"
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">Sin imágenes</span>
              )}
            </div>

            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-800 leading-tight">{producto.nombre}</h3>
                {producto.Categoria && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {producto.Categoria.categoria}
                  </span>
                )}
              </div>
              
              {/* BOTÓN DE ESTADO (DISPONIBLE / AGOTADO) */}
              <div>
                <button
                  type="button"
                  onClick={() => alternarEstadoProducto(producto)}
                  disabled={cargando}
                  className={`text-xs font-bold px-3 py-1 rounded-md border transition-colors ${
                    producto.estado
                      ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                  }`}
                >
                  {producto.estado ? '✓ Disponible' : '✗ Agotado'}
                </button>
              </div>

              <p className="text-sm text-gray-600 mt-1">{producto.descripcion}</p>
              <p className="text-sm text-green-600 font-bold">${producto.precio}</p>
            </div>

            <form
              onSubmit={(e) => manejarActualizacion(e, producto)}
              className="flex flex-col gap-2 p-4 pt-0"
            >
              {/* ... AQUÍ VAN TUS INPUTS ORIGINALES DE ACTUALIZACIÓN ... */}
              <input type="text" name="nombre" placeholder="Nuevo nombre" className="border border-gray-300 rounded-lg text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="text" name="descripcion" placeholder="Nueva descripción" className="border border-gray-300 rounded-lg text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="number" name="precio" placeholder="Nuevo precio" className="border border-gray-300 rounded-lg text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
              <select name="idCategoria" className="border border-gray-300 rounded-lg text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
                <option value="">Cambiar categoría...</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>{cat.categoria}</option>
                ))}
              </select>
              <input type="file" name="imagenes" multiple accept="image/*" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600 cursor-pointer" />

              <button
                type="submit"
                disabled={cargando}
                className="bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {cargando ? 'Cargando...' : 'Actualizar Info/Añadir Fotos'}
              </button>
            </form>
          <button 
            type="button"
            onClick={() => eliminarProducto(producto.id)}
            disabled={cargando}
            className="m-4 mt-0 bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60"
          >
            Eliminar Producto
          </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PanelAdmin;