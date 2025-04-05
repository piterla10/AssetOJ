import React, { useState, useEffect } from 'react';
import usuarioService from '../features/usuarios/usuarioService';
const Modal = ({ show, onClose, onLogout }) => {
  const [usuario, setUsuario] = useState(null);
  // Estado para el tamaño de la fuente, tema y privacidad
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Cargar configuraciones desde localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedFontSize = localStorage.getItem('fontSize');
    const storedPrivacy = localStorage.getItem('privacy');

    if (storedTheme) setIsDarkTheme(storedTheme === 'dark');
    if (storedFontSize) setIsLargeFont(storedFontSize === 'large');
    if (storedPrivacy) setIsPrivate(storedPrivacy === 'private');

    // Establecer el tema y el tamaño de fuente desde el almacenamiento
    document.body.style.backgroundColor = storedTheme === 'dark' ? '#070713' : '#fff';
    document.body.style.color = storedTheme === 'dark' ? '#fff' : '#000';
    document.body.style.fontSize = storedFontSize === 'large' ? '18px' : '14px';
  }, []);

  // Cambiar el tema (oscuro/claro)
  const changeTheme = (isDark) => {
    setIsDarkTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#070713' : '#fff';
    document.body.style.color = isDark ? '#fff' : '#000';
  };

  // Cambiar el tamaño de la fuente
  const changeFontSize = (isLarge) => {
    setIsLargeFont(isLarge);
    localStorage.setItem('fontSize', isLarge ? 'large' : 'normal');
    document.body.style.fontSize = isLarge ? '18px' : '16px';
  };

  // Cambiar privacidad (privado/público)
  const changePrivacy = (isPrivate) => {
    let estado;
    if (isPrivate) {
        estado = 'Privado';
    } else {
        estado = 'Publico';
    }


    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    const body = {
        nombre:usuarioLocal.nombre,
        email:usuarioLocal.email,
        estado:estado
    }
    console.log(body);
        if (usuarioLocal) {
        const fetchAssets = async () => {
            try {
            const usuarioData = await usuarioService.actualizarUsuario(usuarioLocal._id,body);
            setUsuario(usuarioData); // Almacenar los datos del usuario en el estado
            } catch (error) {
            console.error('Error al obtener los assets:', error);
            }
        };

        fetchAssets();
    }
    setIsPrivate(isPrivate);
    localStorage.setItem('privacy', isPrivate ? 'private' : 'public');
    console.log('La privacidad del perfil es ahora: ' + (isPrivate ? 'Privado' : 'Público'));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Tamaño de Fuente */}
        <div>
          <h1 style={{ fontSize: '21px', margin: '0' }}>Tamaño de Fuente</h1>
          <hr />
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
            {/* Normal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '16px' }}>Normal:</h1>
              <label>
                <input
                  type="radio"
                  name="fontSize"
                  checked={!isLargeFont}
                  onChange={() => changeFontSize(false)}
                  style={{ transform: 'scale(1.5)', marginBottom: '10px' }}
                />
              </label>
            </div>

            {/* Grande */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '16px' }}>Grande:</h1>
              <label>
                <input
                  type="radio"
                  name="fontSize"
                  checked={isLargeFont}
                  onChange={() => changeFontSize(true)}
                  style={{ transform: 'scale(1.5)', marginBottom: '10px' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Tema */}
        <div>
          <h1 style={{ fontSize: '21px', margin: '20px 0 0 0' }}>Tema</h1>
          <hr />
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
            {/* Claro */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '16px' }}>Claro:</h1>
              <label>
                <input
                  type="radio"
                  name="theme"
                  checked={!isDarkTheme}
                  onChange={() => changeTheme(false)}
                  style={{ transform: 'scale(1.5)', marginBottom: '10px' }}
                />
              </label>
            </div>

            {/* Oscuro */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '16px' }}>Oscuro:</h1>
              <label>
                <input
                  type="radio"
                  name="theme"
                  checked={isDarkTheme}
                  onChange={() => changeTheme(true)}
                  style={{ transform: 'scale(1.5)', marginBottom: '10px' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div>
          <h1 style={{ fontSize: '21px', margin: '20px 0 0 0' }}>Privacidad</h1>
          <hr />
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
            {/* Privado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '16px' }}>Privado:</h1>
              <label>
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate}
                  onChange={() => changePrivacy(true)}
                  style={{ transform: 'scale(1.5)', marginBottom: '10px' }}
                />
              </label>
            </div>

            {/* Público */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '16px' }}>Público:</h1>
              <label>
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPrivate}
                  onChange={() => changePrivacy(false)}
                  style={{ transform: 'scale(1.5)', marginBottom: '10px' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Cerrar sesión */}
        <button className="btn-header" style={{ width: 200, marginTop: '20px' }} onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Modal;
