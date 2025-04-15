import React, { useState, useRef, useEffect } from 'react';

function EtiquetasDropdown({ opciones, etiquetas, setEtiquetas }) {
  const [abierto, setAbierto] = useState(false);
  const dropdownRef = useRef();

  const toggleEtiqueta = (etiqueta) => {
    if (etiquetas.includes(etiqueta)) {
      setEtiquetas(etiquetas.filter(e => e !== etiqueta));
    } else {
      setEtiquetas([...etiquetas, etiqueta]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setAbierto(!abierto)}
        style={{
          padding: '8px',
          border: '1px solid white',
          background: '#131232',
          color: '#ccc',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        {etiquetas.length > 0 ? etiquetas.join(', ') : 'Selecciona etiquetas'}
      </div>
      {abierto && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#0f0e28',
            border: '1px solid white',
            padding: '10px',
            zIndex: 10,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {opciones.map(etiqueta => (
            <label key={etiqueta} style={{ color: 'white', display: 'block', margin: '5px 0' }}>
              <input
                type="checkbox"
                checked={etiquetas.includes(etiqueta)}
                onChange={() => toggleEtiqueta(etiqueta)}
                style={{ marginRight: '8px' }}
              />
              {etiqueta}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default EtiquetasDropdown;