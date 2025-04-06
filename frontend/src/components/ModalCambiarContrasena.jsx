// ModalCambiarContrasena.jsx
import React, { useState } from 'react';

const ModalCambiarContrasena = ({ show, onClose, onSave }) => {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nuevaContrasena !== repetirContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    onSave(nuevaContrasena); // Envía la nueva contraseña al componente padre
    setNuevaContrasena('');
    setRepetirContrasena('');
    setError('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay"  onClick={onClose}>
      <div className="modal-content"  onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar Contraseña</h2>
        <hr style={{margin:'0'}}></hr>
        
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center',marginTop:'10px'}}>
          <div style={{display:'flex', flexDirection:'column',width:'100%'}}>
            <input
              type="password"
              style={{width:'100%'}}
              className='inputField'
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
            />
            <input
              type="password"
              style={{width:'100%'}}
              className='inputField'
              placeholder="Repetir contraseña"
              value={repetirContrasena}
              onChange={(e) => setRepetirContrasena(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
          <div style={{display:'flex',gap:'15px',marginTop:'10px'}}>
            <button type="submit" className='btn-header'>Guardar</button>
            <button type="button" className='btn-header' onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCambiarContrasena;
