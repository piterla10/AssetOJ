import React from 'react'
import usuarioService from '../features/usuarios/usuarioService';
import { useState, useEffect } from 'react';
import StarRating from '../components/estrellas';
import AssetLista from '../components/AssetLista';

function MiPerfil() {
  const [usuario, setUsuario] = useState(null);  // Inicializamos como null
  const [activo, setActivo] = useState('Mis Assets');
  const [datosUsuario, setDatosUsuario] = useState([]);
  const [valoracionNota, setValoracion] = useState(0);
  
  const opciones = ['Mis Assets', 'Descargas', 'Guardados'];

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    
    if (usuarioLocal) {
      const fetchAssets = async () => {
        try {
          const usuarioData = await usuarioService.obtenerUsuario(usuarioLocal._id);
          setUsuario(usuarioData); // Almacenar los datos del usuario en el estado
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

  return (
    <div className='contenedorPerfilPrincipal'>
      <div className="ParteDatos">
        <div className='parte1'>
          <img
            src={usuario.imagenPerfil}
            alt="Imagen de perfil"
            className="cambiarImagen"
          />
          <h2 className='subtituloPerfil'>{usuario.nombre}</h2>
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
            <img src='https://lh3.googleusercontent.com/d/1lmEovHAO0x41N51UcK63nEXlBQ0tJ9je' className='ajustes'></img>
          </div>
          <div className='campos'>
            <h2 className='subtituloPerfil'>Email:</h2>
            <input
              type="email"
              value={usuario.email}
              className="inputField"
              disabled
            />
            <h2 className='subtituloPerfil'>Contraseña:</h2>
            <input
              type="password"
              value={usuario.password}
              className="inputField"
              disabled
            />
          </div>
        </div>
      </div>
      <div className='parte3'>
        <h2 className='subtituloPerfil'>Descripción:</h2>
        <div className='contenedorDescripcion'>
          <h2 className='descripcion'>{usuario.informacionAutor}</h2>
        </div>
      </div>
      <div className='parte4'>
        {opciones.map((titulo, index) => (
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
        {console.log(datosUsuario)}
        <AssetLista className="lista" cantidad={10} datosUsuario={datosUsuario} />
      </div>
    </div>
  );
}

export default MiPerfil;
