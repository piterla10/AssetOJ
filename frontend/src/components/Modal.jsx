import React, { useState, useEffect } from 'react';
import usuarioService from '../features/usuarios/usuarioService';

const Modal = ({ show, onClose, onLogout }) => {
  const [usuario, setUsuario] = useState(null);

  // 1) Inicializamos el tema a partir de localStorage, o DARK si no hay nada.
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') return false;
    // si es 'dark' o no existe, devolvemos true
    return true;
  });
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // 2) Efecto único para cargar ajustes y aplicarlos al body
  useEffect(() => {
    // Tema
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');

    // Fuente (si lo quieres mantener igual que antes puedes cargar de LS)
    const storedFontSize = localStorage.getItem('fontSize');
    const largeFont      = storedFontSize === 'large';
    setIsLargeFont(largeFont);
    document.body.style.fontSize = largeFont ? '18px' : '16px';

    // Privacidad
    const storedPrivacy = localStorage.getItem('privacy');
    if (storedPrivacy) {
      setIsPrivate(storedPrivacy === 'private');
    }
  }, [isDarkTheme]); // ✅ solo depende de isDarkTheme

  // Cambiar el tema
  const changeTheme = (dark) => {
    setIsDarkTheme(dark);
  };

  // Cambiar fuente
  const changeFontSize = (large) => {
    setIsLargeFont(large);
    localStorage.setItem('fontSize', large ? 'large' : 'normal');
    document.body.style.fontSize = large ? '18px' : '16px';
  };

  // Cambiar privacidad
  const changePrivacy = (priv) => {
    setIsPrivate(priv);
    localStorage.setItem('privacy', priv ? 'private' : 'public');

    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    if (!usuarioLocal) return;

    const body = {
      nombre: usuarioLocal.nombre,
      email:  usuarioLocal.email,
      estado: priv ? 'Privado' : 'Publico'
    };

    usuarioService.actualizarUsuario(usuarioLocal._id, body)
      .then((usuarioData) => setUsuario(usuarioData))
      .catch((err) => console.error('Error al actualizar privacidad:', err));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Tema
        <div>
          <h1 style={{ fontSize: '21px', margin: '20px 0 0' }}>Tema</h1>
          <hr />
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="radio"
                name="theme"
                checked={!isDarkTheme}
                onChange={() => changeTheme(false)}
                style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
              />
              Claro
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="radio"
                name="theme"
                checked={isDarkTheme}
                onChange={() => changeTheme(true)}
                style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
              />
              Oscuro
            </label>
          </div>
        </div> */}

        {/* Privacidad */}
        <div>
          <h1 style={{ fontSize: '21px', margin: '20px 0 0' }}>Privacidad</h1>
          <hr />
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="radio"
                name="privacy"
                checked={isPrivate}
                onChange={() => changePrivacy(true)}
                style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
              />
              Privado
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="radio"
                name="privacy"
                checked={!isPrivate}
                onChange={() => changePrivacy(false)}
                style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
              />
              Público
            </label>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn-header"
          style={{ width: 200, marginTop: '20px' }}
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Modal;
