import React, { useState, useEffect } from 'react';
import usuarioService from '../features/usuarios/usuarioService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/estrellas';
import AssetLista from '../components/AssetLista';
import { logout, reset } from '../features/auth/authSlice';
import Modal from '../components/Modal';
import ModalCambiarContrasena from '../components/ModalCambiarContrasena';
function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [activo, setActivo] = useState('Mis Assets');
  const [datosUsuario, setDatosUsuario] = useState([]);
  const [valoracionNota, setValoracion] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false); // Control de edición para el nombre
  const [isEditingDescripcion, setIsEditingDescripcion] = useState(false); // Control de edición para la descripción
  const [isEditingEmail, setIsEditingEmail] = useState(false); 
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDescripcion, setNewDescripcion] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Función para abrir el modal
  const openModal = () => setIsModalOpen(true);

  // Función para cerrar el modal
  const closeModal = () => setIsModalOpen(false);

  const onLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    closeModal();
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));

    if (usuarioLocal) {
      const fetchAssets = async () => {
        try {
          const usuarioData = await usuarioService.obtenerUsuario(usuarioLocal._id);
          setUsuario(usuarioData);
          setValoracion(usuarioData.valoracionesNota || 0);
          setDatosUsuario(usuarioData.assets); // Establecer los assets al cargar
        } catch (error) {
          console.error('Error al obtener los assets:', error);
        }
      };

      fetchAssets();
    }
  }, []); // Solo se ejecuta al cargar el componente

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  const manejarCambio = (opcion) => {
    setActivo(opcion);
    switch (opcion) {
      case 'Mis Assets':
        setDatosUsuario(usuario.assets);
        break;
      case 'Descargas':
        setDatosUsuario(usuario.descargas);
        break;
      case 'Guardados':
        setDatosUsuario(usuario.guardados);
        break;
      default:
        setDatosUsuario([]);
    }
  };

  // Función para habilitar la edición del nombre
  const handleEditName = () => {
    setNewName(usuario.nombre);
    setIsEditingName(true);
  };
  const handleEditEmail = () => {
    setNewEmail(usuario.email);
    setIsEditingEmail(true);
  };

  // Función para habilitar la edición de la descripción
  const handleEditDescripcion = () => {
    setNewDescripcion(usuario.informacionAutor);
    setIsEditingDescripcion(true);
  };
  const handleSavePassword = async (nuevaPassword) => {
    try {
      await usuarioService.actualizarContrasena(usuario._id, {
        password: nuevaPassword,
      });
      alert('Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar contraseña', error);
    }
  };
  const handleImageClick = () => {
    // Llamar al input para seleccionar la imagen
    document.getElementById('fileInput').click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vista previa (opcional)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPerfil(reader.result); // Actualiza la vista previa
      };
      reader.readAsDataURL(file);
  
      // Llama al servicio para subir la imagen
      try {
        const formData = new FormData();
        formData.append('imagen', file); // Nombre del campo que espera tu backend
  
 
        const updatedUser = await usuarioService.actualizarImagenPerfil(usuario._id, formData);
  
        setUsuario(updatedUser); // Actualiza el estado del usuario
      } catch (error) {
        console.error('Error al cambiar la imagen de perfil:', error);
      }
    }
  };
  // Función para guardar cambios
  const handleSaveChanges = async () => {
    try {
      // Aquí actualizar los campos que deseas cambiar
      const updatedUser = await usuarioService.actualizarUsuario(usuario._id, {
        nombre: newName || usuario.nombre,  // Si newName está vacío, se usa el valor original
        email: newEmail || usuario.email,  // Si newEmail está vacío, se usa el valor original
        informacionAutor: newDescripcion || usuario.informacionAutor,
      });

      setUsuario(updatedUser);
      setIsEditingName(false);
      setIsEditingDescripcion(false);
      setIsEditingEmail(false); 
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  return (
    <div className='contenedorPerfilPrincipal'>
      <div className="ParteDatos">
        <div className='parte1'>
          <div className='marginLeft'>
            <img
              src={imagenPerfil || usuario.imagenPerfil}
              alt="Imagen de perfil"
              className="cambiarImagen"
              onClick={handleImageClick}
            />
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              accept="image/*" 
              onChange={handleFileChange}
            />
            <div className='divParaIcono'>
              <h2 className='subtituloPerfil'>
                {isEditingName ? (
                  <input
                    type="text"
                    value={newName || usuario.nombre}
                    className="inputField"
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveChanges();
                      }
                    }}
                    onBlur={() => {
                      if (isEditingName) {
                        handleSaveChanges();
                      }
                    }}
                  />
                ) : (
                  usuario.nombre
                )}
              </h2>
              <img className='botonIcono' src='/editar.png' onClick={handleEditName} />
            </div>
          </div>
          <div className="contenedorValoracion">
            <StarRating value={valoracionNota} className="starRating" />
            <p className="letraNano">{usuario.valoracionesNum} valoraciones</p>
          </div>
        </div>
        <div className='parte2'>
          <div className='seguidos'>
            <div>
              <h2 className='subtituloPerfil'>Seguidores</h2>
              <h2 className='subtituloPerfil'>{usuario.seguidores.length || 0}</h2>
            </div>
            <div>
              <h2 className='subtituloPerfil'>Seguidos</h2>
              <h2 className='subtituloPerfil'>{usuario.seguidos.length || 0}</h2>
            </div>
            <img src='https://lh3.googleusercontent.com/d/1lmEovHAO0x41N51UcK63nEXlBQ0tJ9je' onClick={openModal} className='ajustes' />
            <Modal
              show={isModalOpen}
              onClose={closeModal}
              onLogout={onLogout}
            />
          </div>
          <div className='campos'>
            <h2 className='subtituloPerfil'>Email:</h2>
            <div className='divParaIcono2'>
              <input
                type="email"
                value={newEmail || usuario.email}
                className="inputField"
                disabled={!isEditingEmail} // No se puede editar si no estás en modo de edición del nombre
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveChanges();
                  }
                }}
                onBlur={() => {
                  if (isEditingEmail) {
                    handleSaveChanges();
                  }
                }}
              />
              <img className='botonIcono' src='/editar.png' onClick={handleEditEmail} />
            </div>
            <h2 className='subtituloPerfil'>Contraseña:</h2>
            <div className='divParaIcono2'>
              <input
                type="password"
                value="...."
                className="inputField"
                disabled
              />
              <img className='botonIcono' src='/editar.png'  onClick={() => setShowPasswordModal(true)} />
              <ModalCambiarContrasena
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSave={handleSavePassword}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='parte3'>
        <h2 className='subtituloPerfil'>Descripción:</h2>
        <div className='contenedorDescripcion'>
          {isEditingDescripcion ? (
            <input
              type="text"
              value={newDescripcion || usuario.informacionAutor}
              className="inputField"
              onChange={(e) => setNewDescripcion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveChanges();
                }
              }}
              onBlur={() => {
                if (isEditingDescripcion) {
                  handleSaveChanges();
                }
              }}
            />
          ) : (
            <h2 className='descripcion'>{usuario.informacionAutor}</h2>
          )}
          <img className='botonIcono' src='/editar.png' onClick={handleEditDescripcion} />
        </div>
      </div>
      <div className='parte4'>
        {['Mis Assets', 'Descargas', 'Guardados'].map((titulo, index) => (
          <React.Fragment key={titulo}>
            <div className='submenuMiPerfil' onClick={() => manejarCambio(titulo)}>
              <h1 className={`tituloPersonalizado ${activo === titulo ? 'activo' : ''}`}>
                {titulo}
              </h1>
            </div>
            {index !== 2 && <div className="separadorPerfil"></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="lineaDebajo"></div>
      <div className='assetsPerfil'>
        <AssetLista className="lista" cantidad={10} datosUsuario={datosUsuario} />
      </div>

      {/* Botón para guardar cambios */}
      {(isEditingName || isEditingDescripcion || isEditingEmail) && (
        <button onClick={handleSaveChanges}>Guardar cambios</button>
      )}
    </div>
  );
}

export default MiPerfil;
