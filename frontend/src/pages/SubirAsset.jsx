import React, { useState } from 'react';
import DropdownEtiquetas from '../components/EtiquetasDrop';
import ImageUploader from '../components/imagenVer'; 
function SubirAsset() {
  const [categoria, setCategoria] = useState('');
  const [visibilidad, setVisibilidad] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showVisibilidad, setShowVisibilidad] = useState(false);
  
  const categorias = ['3D', '2D', 'Audio','Add-On'];
  const opcionesVisibilidad = ['Público', 'Privado'];
  const opcionesEtiquetas = [
    'Animaciones', 'Personajes', 'Fondos', 'Vehículos',
    'Vegetación', 'GUI', 'Animales', 'Formas', 'Accesorios'
  ];
  const [archivoCargado, setArchivoCargado] = useState(null);

  const handleArchivoGeneral = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoCargado(archivo);
    }
  };
  return (
    <div style={{ width: '100%', height: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ padding: '15px', background: '#121130', width: '50%', height: '100%', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
        <h1>Subir Asset</h1>
        <hr style={{ width: '80%' }} />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%', alignItems: 'center', gap: '10px' ,padding:'10px'}}>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent:'center' }}>
          {/* Subida de imágenes */}
          <ImageUploader />
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
            Seleccionar archivo (3D, imagen, sonido, Add-On)
          </button>

     
        </div>
          <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: '10px', gap: '10px' }}>
            <input type="text" placeholder='Título' style={{ width: '100%', padding: '8px', border: '1px solid white', background: '#131232', color: '#ccc' }} />

            <textarea placeholder="Descripción" style={{  maxHeight: '150px', resize: 'vertical', width: '100%', backgroundColor: '#131232', color: '#ccc', border: '1px solid #ccc', padding: '10px', fontSize: '16px' }} />

            {/* Categoría Dropdown */}
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '8px',  border: '1px solid white', background: '#131232', color: '#ccc' }}>
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Visibilidad Dropdown */}
            <select value={visibilidad} onChange={(e) => setVisibilidad(e.target.value)} style={{ padding: '8px', border: '1px solid white', background: '#131232', color: '#ccc' }}>
              <option value="">Selecciona visibilidad</option>
              {opcionesVisibilidad.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            {/* Etiquetas multiselección    <h1 style={{marginBottom:'0px',marginTop:'10px',fontSize:'20px'}}>Etiquetas</h1>
            <hr></hr>*/}
            {/* Etiquetas Dropdown múltiple */}
            <DropdownEtiquetas
              opciones={opcionesEtiquetas}
              etiquetas={etiquetas}
              setEtiquetas={setEtiquetas}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubirAsset;
