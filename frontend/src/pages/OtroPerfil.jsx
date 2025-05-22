
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
import { useParams } from 'react-router-dom';

function OtroPerfil() {
  const { id } = useParams();

  const [esSeguido, setEsSeguido] = useState(false);
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
    if (usuario && datosUsuario) {
      setEsSeguido(usuario.seguidores.includes(datosUsuario._id));
    }
  }, [usuario, datosUsuario]);
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
    const handleToggleSeguir = async () => {
    const body = {
      idSeguidor:datosUsuario._id,
      idSeguido:usuario._id
    }
    try {
      if (esSeguido) {
        await usuarioService.DejarseguirUsuario(body);
      } else {
        await usuarioService.seguirUsuario(body);
      }
      {console.log(esSeguido)}
      // Refresca el usuario visualmente (ideal si vuelves a pedir el usuario)
      const usuarioActualizado = await usuarioService.obtenerUsuario(usuario._id);
      setUsuario(usuarioActualizado);
    } catch (error) {
      console.error("Error al cambiar estado de seguimiento:", error);
    }
  };



  useEffect(() => {
    const usuarioLocal = id;

    if (usuarioLocal) {
   
      const fetchAssets = async () => {
        try {
          
          const usuarioData = await usuarioService.obtenerUsuario(usuarioLocal);
          console.log(usuarioData);
          setUsuario(usuarioData);
          setValoracion(usuarioData.valoracionesNota || 0);
      
          setDatosUsuario(usuarioData.assets);
          console.log(usuarioData)
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

  
  return (
    
   <>     
   <div className="ParteDatos">
        <div className='parte1'> 
          <div className='marginLeft'>
            <img
              src={imagenPerfil || usuario.imagenPerfil}
              alt="Imagen de perfil"
              className="imagenOtroPerfil"
            />
            <div className='divParaIcono'>
              <h2 className='subtituloPerfil' style={{marginTop:'5px',marginRight:'5px'}}>
                  {usuario.nombre}
              </h2>
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
              
          </div>
          <div style={{textAlign:'left',marginLeft:'80px',marginTop:'50px'}} >
          {datosUsuario._id !== usuario._id && (
                <button
                  onClick={handleToggleSeguir}
                  className='inputField'
                  style={{width:'70px',padding:'10px'}}
                >
                  {esSeguido ? 'Dejar de seguir' : 'Seguir'}
                </button>
              )}
            </div>
          <div className='campos'>
            <h2 className='subtituloPerfil'>Email:</h2>
            <div className='divParaIcono2'>
              <input
                type="email"
                value={newEmail || usuario.email}
                className="inputField"
                disabled={!isEditingEmail} // No se puede editar si no estás en modo de edición del nombre
              />
            </div>
          </div>
        </div>
      </div>
       <div className='parte3' style={{display:'flex'}}>
          <h2 style={{ marginBottom: '0px', padding: '10px', textAlign: 'center' }}>Descripción</h2>
          <h2 className='descripcion' style={{fontSize:'16px' , justifyContent:'center',alignItems:'center',marginTop:'0px'}}>
            {usuario.informacionAutor}
          </h2>
        </div>
        <div className='parte4'>
         <div>
            <h1>
              Assets Publicados
            </h1>
          </div>
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
            {console.log(datosUsuario)}
            <AssetLista className="lista" cantidad={cantidadAssets} paginacion={paginaActual*cantidadAssets} orden={ordenSeleccionado} cantidadTotal={handleCantidadTotal} datosUsuario={datosUsuario} />
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
</>
  );
}

export default OtroPerfil