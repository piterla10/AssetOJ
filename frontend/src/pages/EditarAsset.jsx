import React, { useEffect, useState } from 'react';
import DropdownEtiquetas from '../components/EtiquetasDrop';
import assetService from '../features/assets/assetService';
import ImageUploader from '../components/imagenVer'; 
import usuarioService from '../features/usuarios/usuarioService';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function EditarAsset() {
  const [categoria, setCategoria] = useState('');
  // id del asset
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [visibilidad, setVisibilidad] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [titulo, setTitulo] = useState('');
  const [showCategorias, setShowCategorias] = useState(false);
  const [showVisibilidad, setShowVisibilidad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [modalMensaje, setModalMensaje] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const categorias = ['3D', '2D', 'Audio','Add-On'];
  const opcionesVisibilidad = ['publico', 'privado'];
  const filtrosPorCategoria = {
      '3D': ['Animaciones', 'Personajes', 'Fondos', 'Vehiculos', 'Vegetacion', 'GUI', 'Animales', 'Formas', 'Accesorios'],
      '2D': ['Personajes', 'Fondos', 'Fuentes', 'Texturas y Materiales', 'Vegetación', 'GUI'],
      'Audio': ['Ambiente', 'SonidoFX', 'Música'],
      'Add-On': ['Personajes', 'Fondos'],
    };
  
    const etiquetasFiltradas = filtrosPorCategoria[categoria] || [];
  
    useEffect(() => {
      setEtiquetas([]); // Reset etiquetas al cambiar de categoría
    }, [categoria]);
  const [archivoCargado, setArchivoCargado] = useState(null);

  const handleArchivoGeneral = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoCargado(archivo);
    }
  };

       
       
  // 1. Efecto para cargar el asset
  useEffect(() => {
    const fetchAsset = async () => {
      try {
         const data = await assetService.getAsset(id);
        setAsset(data.assets);
      } catch (error) {
        console.error("Error al obtener el asset:", error);
      }
    };
    fetchAsset();
  }, [id]);

  // 2. Efecto que corre **solo** cuando `asset` cambie
  useEffect(() => {
    if (!asset) return;
    setCategoria(asset.tipo);
    setVisibilidad(asset.visibilidad);
    setEtiquetas(asset.etiquetas);
    setDescripcion(asset.descripcion || '');
    setTitulo(asset.nombre);

    // Mostrar imágenes existentes
    if (asset.imagenes && asset.imagenes.length > 0) {
    const precargadas = asset.imagenes.map(b64 => ({
      file: null,
      url:  b64
    }));
    setImagenes(precargadas);
  }

    // Mostrar archivo existente
    if (asset.nombreArchivo) {
      setArchivoCargado({ name: asset.nombreArchivo, preview: true });
    }

  }, [asset]);

  const handleConfirmar = async () => {
    if (!categoria || !visibilidad || !titulo.trim()) {
      setModalMensaje("Por favor, completa todos los campos obligatorios.");
      setModalVisible(true);
      return;
    }

    try {
      const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      // Solo convertir imágenes si hay nuevas
      let imagenesBase64 = null;
      if (imagenes.length > 0) {
        imagenesBase64 = await Promise.all(imagenes.map((img) => convertToBase64(img.file)));
      }

      // Solo convertir archivo si hay uno nuevo
      let contenidoBase64 = null;
      let extension = asset?.extension || '';
      let nombreArchivo = asset?.nombreArchivo || '';
      if (archivoCargado) {
        contenidoBase64 = await convertToBase64(archivoCargado);
        const originalName = archivoCargado.name;
        extension = originalName.split('.').pop();
        nombreArchivo = originalName.replace(/\.[^/.]+$/, '');
      }

      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario || !usuario._id) {
        throw new Error("Usuario no encontrado en localStorage");
      }

      const datosAsset = {
        nombre: titulo,
        descripcion,
        tipo: categoria,
        visibilidad,
        etiquetas,
        // Solo incluimos los nuevos si los hay
        ...(imagenesBase64 && { imagenes: imagenesBase64 }),
        ...(contenidoBase64 && { contenido: contenidoBase64, extension, nombreArchivo }),
        fechaModificacion: new Date().toISOString()
      };

      const response = await assetService.editarAsset({id, asset: datosAsset, usuario});

      setModalMensaje("El asset ha sido modificado correctamente.");
      setModalVisible(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("❌ Error al modificar el asset:", error);
      setModalMensaje("Hubo un error al modificar el asset. Inténtalo de nuevo.");
      setModalVisible(true);
    }
  };

  
  return (
    
    <div style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'0' }}>
            {modalVisible && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1b1a3a',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '10px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <p style={{ marginBottom: '20px' }}>{modalMensaje}</p>
            <button
              onClick={() => setModalVisible(false)}
              style={{
                background: '#121130',
                color: '#fff',
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div style={{ padding: '15px', background: '#121130', width: '50%', height: '100%', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
        <h1>Editar Asset</h1>
        <hr style={{ width: '80%' }} />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%', alignItems: 'center', gap: '10px' ,padding:'10px'}}>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px', padding:'10px' }}>
          {/* Subida de imágenes */}
          <ImageUploader imagenes={imagenes} setImagenes={setImagenes} />
               {/* Mostrar archivo cargado */}
          {archivoCargado && (
            <div style={{ color: '#ccc', fontSize: '14px', background: '#1b1a3a', padding: '10px', borderRadius: '6px' }}>
              <strong>Archivo seleccionado:</strong> {archivoCargado.name}
            </div>
          )}

           {/* Input oculto para archivo */}
           <input
            type="file"
            id="archivoGeneral"
            style={{ display: 'none' }}
            onChange={handleArchivoGeneral}
          />

          {/* Botón personalizado */}
          <button
            onClick={() => document.getElementById('archivoGeneral').click()}
            style={{
              background: '#121130',
              color: '#d9d9d9',
              fontWeight: '500',
              padding: '12px 20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '15px',
              width: '100%',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#1b1a3a';
              e.target.style.borderColor = '#fff';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#121130';
              e.target.style.borderColor = '#ccc';
              e.target.style.color = '#d9d9d9';
            }}
          >
            Cambiar archivo (3D, imagen, sonido, Add-On)
          </button>
          ❗Seleccionar archivo o imagenes solo en caso de querer cambiarlos❗

     
        </div>
          <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: '10px', gap: '10px' }}>
            <input type="text" placeholder='Título' value={titulo} onChange={e => setTitulo(e.target.value)}style={{ width: '100%', padding: '8px', border: '1px solid white', background: '#131232', color: '#ccc' }} />

            <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{  maxHeight: '150px', resize: 'vertical', width: '100%', backgroundColor: '#131232', color: '#ccc', border: '1px solid #ccc', padding: '10px', fontSize: '16px' }} />

            {/* Categoría Dropdown */}
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '15px',  border: '1px solid white', background: '#131232', color: '#ccc' }}>
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Visibilidad Dropdown */}
            <select value={visibilidad} onChange={(e) => setVisibilidad(e.target.value)} style={{ padding: '8px', border: '1px solid white', background: '#131232', color: '#ccc' }}>
              <option value="">Selecciona visibilidad</option>
              {opcionesVisibilidad.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            {/* Etiquetas Dropdown múltiple */}
            <DropdownEtiquetas
              opciones={etiquetasFiltradas}
              etiquetas={etiquetas}
              setEtiquetas={setEtiquetas}
            />
          </div>
        </div>
        {/* Botón Confirmar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', width: '100%' }}>
          <button
            onClick={handleConfirmar}
            style={{
              background: '#252360',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#02360';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#252360';
            }}
          >
            Modificar
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditarAsset;