import React, { useRef } from 'react';

const MAX_IMAGENES = 5;
const PLACEHOLDER_URL = "imagen.webp";

const ImageUploader = ({ imagenes, setImagenes }) => {
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const nuevosArchivos = files.slice(0, MAX_IMAGENES - imagenes.length);
    const previews = nuevosArchivos.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImagenes((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes.splice(index, 1);
    setImagenes(nuevasImagenes);
  };

  const openFilePicker = () => {
    if (imagenes.length >= MAX_IMAGENES) return;
    inputRef.current.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Imagen principal */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={imagenes[0]?.url || PLACEHOLDER_URL}
          alt="Principal"
          style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
        />
      </div>

      {/* Miniaturas (5 siempre) */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {[...Array(MAX_IMAGENES)].map((_, index) => {
          const imagen = imagenes[index];

          return (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={imagen?.url || PLACEHOLDER_URL}
                alt={`Miniatura ${index}`}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  border: '2px solid white',
                  borderRadius: '4px',
                  opacity: imagen ? 1 : 0.4,
                }}
              />
              {imagen && (
                <button
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '14px',
                    backgroundColor: 'red',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      {/* Botón de carga */}
      <button
        onClick={openFilePicker}
        style={{
          background: '#121130',
          color: '#d9d9d9',
          fontWeight: '500',
          padding: '12px 20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: imagenes.length >= MAX_IMAGENES ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          fontSize: '15px',
          width: '100%',
          opacity: imagenes.length >= MAX_IMAGENES ? 0.5 : 1,
          transition: 'all 0.3s ease',
        }}
      >
        {imagenes.length >= MAX_IMAGENES ? 'Máximo 5 imágenes' : 'Seleccionar imágenes'}
      </button>
    </div>
  );
};

export default ImageUploader;
