import React, { useState, useEffect, useRef} from 'react';
import usuarioService from '../features/usuarios/usuarioService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/estrellas';
import AssetLista from '../components/AssetLista';
import { logout, reset } from '../features/auth/authSlice';
import Modal from '../components/Modal';
import ModalCambiarContrasena from '../components/ModalCambiarContrasena';
import assetService from '../features/assets/assetService';
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
  const [cantidadAssets, setCantidadAssets] = useState(20);
  const [listaVisible, setListaVisible] = useState(false); // Controla si la lista está visible
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('Seleccionar'); // Valor por defecto
  const [resultadosVisible, setResultadosVisible] = useState(false); // Para "Resultados"
  const [cantidadAssetsTotal, setAssetsTotal] = useState(0); // Para "Resultados"
  const [paginasTotales, setPaginasTotales] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);
  const listaRef = useRef(null); // Referencia para la lista desplegable
  const toggleButtonRef = useRef(null);
  // Ref para el botón de resultados
  const resultadosListaRef = useRef(null);
  const resultadosToggleRef = useRef(null);
  
  // Función para mostrar u ocultar la lista
  const toggleLista = () => {
    setListaVisible(!listaVisible);
  };

  // Función para manejar la selección de un valor
  const handleSeleccionar = (valor) => {
    setOrdenSeleccionado(valor); // Cambia el valor seleccionado
    setListaVisible(false); // Cierra la lista al hacer una selección
  };

  const handleClickOutside = (event) => {
    const target = event.target;
  
    // Cerrar lista de "Ordenar Por"
    if (
      listaRef.current &&
      toggleButtonRef.current &&
      !listaRef.current.contains(target) &&
      !toggleButtonRef.current.contains(target)
    ) {
      setListaVisible(false);
    }
  
    // Cerrar lista de "Resultados"
    if (
      resultadosListaRef.current &&
      resultadosToggleRef.current &&
      !resultadosListaRef.current.contains(target) &&
      !resultadosToggleRef.current.contains(target)
    ) {
      setResultadosVisible(false);
    }
  };
  const handleCantidadTotal = (total) => {
    setAssetsTotal(total);

    const paginas = Math.max(1, Math.ceil(total / cantidadAssets));
   
    setPaginasTotales(paginas);
  };


  const handleCalculoPaginas = () => {
    const paginas = Math.ceil(cantidadAssetsTotal / cantidadAssets);
 
    setPaginasTotales(paginas);
  };
  useEffect(() => {
    // Solo al montar/desmontar
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (cantidadAssets > 0 && cantidadAssetsTotal > 0) {
      handleCalculoPaginas();
    }
  }, [cantidadAssets, cantidadAssetsTotal]);

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
   
          setDatosUsuario(usuarioData.assets);
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
              src={usuario?.imagenPerfil || '/fotoPerfil.png'}
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
            <StarRating value={valoracionNota} lugar={1}/>
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
            <img src='/engranaje.png' onClick={openModal} className='ajustes' />
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
        <h2 className='subtituloPerfil' style={{fontSize:'25px'}}>Descripción</h2>
       
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
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px', alignItems:'center' }}>
        <div style={{justifySelf:'left', position:'absolute',left:'150px'}}>
          <h1 style={{ fontSize: '12px', margin:'0'}}>1 - {cantidadAssets} de {cantidadAssetsTotal} resultados</h1>
        </div>
         {/* Título Ordenar Por */}
        <h1 
          style={{ fontSize: '18px', margin:'0' }} 
        >
          Ordenar Por
        </h1>

        {/* Lista desplegable */}
        {listaVisible && (
          <ul
            ref={listaRef}
            style={{
              listStyleType: 'none',
              padding: '0',
              margin: '5px 0',
              border: '1px solid #ccc',
              position: 'absolute',
              marginTop:'180px',
              backgroundColor: '#252360',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              zIndex: '1000',
              width: '160px',
              cursor: 'pointer',
            }}
          >
            {['Popularidad', 'Descargas', 'Nombre', 'Likes'].map((valor) => (
              <li
                key={valor}
                onClick={() => handleSeleccionar(valor)}
                style={{
                  padding: '10px',
                  backgroundColor: ordenSeleccionado === valor ? '#DB6D6D' : 'transparent',
                  color: ordenSeleccionado == 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {valor}
              </li>
            ))}
          </ul>
        )}

        {/* Mostrar el valor seleccionado */}
        <div  ref={toggleButtonRef} onClick={toggleLista}  style={{marginLeft:'10px', padding:'5px 10px',marginTop:'3px', fontSize: '14px', fontWeight: 'bold', cursor:'pointer',background:'#252360'}}>
          {ordenSeleccionado}
        </div>
        <div style={{ marginLeft: '20px',  display: 'flex', alignItems:'center',gap:'10px' }}>
          <h1 style={{ fontSize: '18px', margin: '0' }}>Resultados</h1>

          <div
            ref={resultadosToggleRef}
            onClick={() => setResultadosVisible(!resultadosVisible)}
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#252360',
              padding: '8px 12px',
              cursor: 'pointer',
              marginTop: '5px',
              display: 'inline-block',
            }}
          >
            {cantidadAssets}
          </div>

          {resultadosVisible && (
            <ul
              ref={resultadosListaRef}
              style={{
                listStyleType: 'none',
                marginTop: '220px',
                marginLeft:'110px',
                padding: 0,
                backgroundColor: '#252360',
                border: '1px solid #ccc',
                position: 'absolute',
                zIndex: 1000,
                width: '80px',
              }}
            >
              {['10', '20', '30', '40', '50'].map((valor) => (
                <li
                  key={valor}
                  onClick={() => {
                    setCantidadAssets(Number(valor));
                    setResultadosVisible(false);
                  }}
                  style={{
                    padding: '10px',
                    backgroundColor: cantidadAssets === Number(valor) ? '#DB6D6D' : 'transparent',
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {valor}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='contenedorPrincipal'>
        <div className='contenedor'>
          <div className='contenedor2'>
            {activo === 'Mis Assets'
              ? (
                <AssetLista
                  className="lista"
                  cantidad={cantidadAssets}
                  paginacion={paginaActual * cantidadAssets}
                  orden={ordenSeleccionado}
                  cantidadTotal={handleCantidadTotal}
                  datosUsuario={datosUsuario}
                  privAsset={true}
                  privAutor={true}
                />
              )
              : (
                <AssetLista
                  className="lista"
                  cantidad={cantidadAssets}
                  paginacion={paginaActual * cantidadAssets}
                  orden={ordenSeleccionado}
                  cantidadTotal={handleCantidadTotal}
                  datosUsuario={datosUsuario}
                />
              )
            }
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              {/* Botón anterior */}
              <button
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 0))}
                disabled={paginaActual === 0}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#121130',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: paginaActual === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ←
              </button>

              {/* Página actual (mostramos +1 al usuario) */}
              <span style={{ alignSelf: 'center', fontWeight: 'bold', color: 'white' }}>
                Página {paginaActual + 1} de {paginasTotales}
              </span>

              {/* Botón siguiente */}
              <button
                onClick={() => setPaginaActual((prev) => Math.min(prev + 1, paginasTotales - 1))}
                disabled={paginaActual === paginasTotales - 1}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#121130',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: paginaActual === paginasTotales - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para guardar cambios */}
      {(isEditingName || isEditingDescripcion || isEditingEmail) && (
        <button onClick={handleSaveChanges}>Guardar cambios</button>
      )}
    </div>
  );
}

export default MiPerfil;
