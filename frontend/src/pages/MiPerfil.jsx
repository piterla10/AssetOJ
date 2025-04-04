import React from 'react'
import usuarioService from '../features/usuarios/usuarioService';
import { useState } from 'react';
import StarRating from '../components/estrellas';

function MiPerfil() {
    // Cargar los assets cuando la categoría activa cambia
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [email, setEmail] = useState(usuario.email);
    const [password, setPassword] = useState(usuario.password);
    const [nombre, setNombre] = useState(usuario.nombre);
    const [imagenPerfil, setImagenPerfil] = useState(usuario.imagenPerfil);
    const [valoracionNota, setValoracion] = useState(usuario.valoracionesNota || 0);
    console.log(valoracionNota);
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
    
    const handleNombreChange = (e) => {
      setNombre(e.target.value);
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

          </div>
          <div className='campos'>
            <h2 className='subtituloPerfil'>Email:</h2>
            <input
              type="email"
              value={usuario.email}
              onChange={handleEmailChange}
              className="inputField"
            />
            <h2 className='subtituloPerfil'>Contraseña:</h2>
            <input
              type="password"
              value={usuario.password}
              onChange={handlePasswordChange}
              className="inputField"
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
        <div className='submenuMiPerfil'>
          <h1 className='tituloPersonalizado'>Mis Assets</h1>
        </div>
        <div className="separadorPerfil"></div> 
        <div className='submenuMiPerfil'>
          <h1 className='tituloPersonalizado'>Descargas</h1>
        </div>
        <div className="separadorPerfil"></div> 
        <div className='submenuMiPerfil'>
          <h1 className='tituloPersonalizado'>Guardados</h1>
        </div>
      </div>
      <div className="lineaDebajo"></div>
    </div>
  )
}

export default MiPerfil