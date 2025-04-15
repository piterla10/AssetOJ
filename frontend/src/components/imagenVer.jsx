import React, { useState, useRef } from 'react';

const ImageUploader = () => {
  const [imagenes, setImagenes] = useState([]);
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
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
    inputRef.current.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* vista previa (ahora arriba del botón) */}
      {imagenes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
          {imagenes.map((imagen, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={imagen.url}
                alt={`Preview ${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'red',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* input escondido */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      {/* botón bonito */}
      <button
        onClick={openFilePicker}
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
        Seleccionar imágenes
      </button>
    </div>
  );
};

export default ImageUploader;
