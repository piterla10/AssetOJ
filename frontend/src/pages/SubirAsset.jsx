import React, { useState, useEffect } from 'react';
import DropdownEtiquetas from '../components/EtiquetasDrop';
import assetService from '../features/assets/assetService';
import ImageUploader from '../components/imagenVer'; 
import usuarioService from '../features/usuarios/usuarioService';
import { useNavigate } from 'react-router-dom';

function SubirAsset() {
  const [categoria, setCategoria] = useState('');
  const [visibilidad, setVisibilidad] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [archivoCargado, setArchivoCargado] = useState(null);
  const navigate = useNavigate();
   const [botonDisabled, setBotonDisabled] = useState(false);
  const categorias = ['3D', '2D', 'Audio', 'Add-On'];
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

  const handleArchivoGeneral = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoCargado(archivo);
    }
  };

  const handleConfirmar = async () => {
    setBotonDisabled(true);
    if (!archivoCargado || !categoria || !visibilidad) {
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

      const imagenesBase64 = await Promise.all(
        imagenes.map((img) => convertToBase64(img.file))
      );

      const contenidoBase64 = await convertToBase64(archivoCargado);

      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!usuario || !usuario._id) {
        throw new Error("Usuario no encontrado en localStorage");
      }
      
      // para subir al cloudinary el archivo con su nombre real y extensión
      const originalName = archivoCargado.name;
      const extension = originalName.split('.').pop();
      const baseName = originalName.replace(/\.[^/.]+$/, '');

      const datosAsset = {
        nombre: document.querySelector('input[placeholder="Título"]').value,
        descripcion: document.querySelector('textarea').value,
        tipo: categoria,
        visibilidad,
        etiquetas,
        imagenes: imagenesBase64,
        contenido: contenidoBase64,
        extension,
        baseName,
        likes: [],
        descargas: 0,
        valoracion: [],
        valoracionNota: 0,
        comentarios: [],
        fecha: new Date().toISOString(),
      };

      const response = await assetService.crearAsset(datosAsset, usuario);
      console.log("📦 Respuesta del backend:", response);

      setModalMensaje("El asset: " + datosAsset.nombre + " ha sido subido correctamente");
      setModalVisible(true);
      setBotonDisabled(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error("❌ Error al subir el asset:", error);
      setModalMensaje("Ha habido un error subiendo el asset, por favor, intentalo de nuevo.");
      setModalVisible(true);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {modalVisible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#1b1a3a', color: 'white', padding: '20px 30px',
            borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <p style={{ marginBottom: '20px' }}>{modalMensaje}</p>
            <button onClick={() => setModalVisible(false)} style={{
              background: '#121130', color: '#fff', padding: '10px 20px',
              border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer',
            }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div style={{ background: '#121130', width: '50%', padding: '20px', color: 'white', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' }}>
        <h1>Subir Asset</h1>
        <hr style={{ width: '80%' }} />

        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ImageUploader imagenes={imagenes} setImagenes={setImagenes} />

            {archivoCargado && (
              <div style={{ background: '#1b1a3a', padding: '10px', borderRadius: '6px', color: '#ccc' }}>
                <strong>Archivo seleccionado:</strong> {archivoCargado.name}
              </div>
            )}

            <input
              type="file"
              id="archivoGeneral"
              style={{ display: 'none' }}
              onChange={handleArchivoGeneral}
            />

            <button
              onClick={() => document.getElementById('archivoGeneral').click()}
              style={{
                background: '#121130', color: '#d9d9d9', padding: '12px 20px',
                border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer',
                fontSize: '15px', transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { e.target.style.background = '#1b1a3a'; e.target.style.borderColor = '#fff'; e.target.style.color = '#fff'; }}
              onMouseOut={(e) => { e.target.style.background = '#121130'; e.target.style.borderColor = '#ccc'; e.target.style.color = '#d9d9d9'; }}
            >
              Seleccionar archivo (3D, imagen, sonido, Add-On)
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder='Título' style={{ padding: '8px', border: '1px solid white', background: '#131232', color: '#ccc' }} />
            <textarea placeholder="Descripción" style={{ maxHeight: '150px', resize: 'vertical', backgroundColor: '#131232', color: '#ccc', border: '1px solid #ccc', padding: '10px', fontSize: '16px' }} />

            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '12px', border: '1px solid white', background: '#131232', color: '#ccc' }}>
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select value={visibilidad} onChange={(e) => setVisibilidad(e.target.value)} style={{ padding: '12px', border: '1px solid white', background: '#131232', color: '#ccc' }}>
              <option value="">Selecciona visibilidad</option>
              {opcionesVisibilidad.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            <DropdownEtiquetas
              opciones={etiquetasFiltradas}
              etiquetas={etiquetas}
              setEtiquetas={setEtiquetas}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button
            onClick={handleConfirmar}
            disabled={botonDisabled}
            style={{
              background: '#252360', color: 'white', fontWeight: 'bold',
              padding: '12px 30px', border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontSize: '16px'
            }}
              onMouseOver={(e) => {
                if (!botonDisabled) e.target.style.background = '#02360';
              }}
              onMouseOut={(e) => {
                if (!botonDisabled) e.target.style.background = '#252360';
              }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubirAsset;
