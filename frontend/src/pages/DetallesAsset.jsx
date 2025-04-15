import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import assetService from '../features/assets/assetService';
import StarRating from '../components/estrellas';
import usuarioService from '../features/usuarios/usuarioService';
import { FaHeart } from "react-icons/fa";

function DetallesAsset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [imgPrincipal, setImgPrincipal] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [comentario, setComentario] = useState('');
  const [haylike, setHayLike] = useState(false);

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));

    const fetchAsset = async () => {
      try {
        // obtengo el usuario que somos de la bd para la foto de perfil de abajo
        const usuarioData = await usuarioService.obtenerUsuario(usuarioLocal._id);
        setUsuario(usuarioData);

        // obtengo el asset de la bd
        const data = await assetService.getAsset(id);
        setAsset(data.assets);
        setImgPrincipal(data.assets.imagenes[0]);
        if (asset && usuario) {
          setHayLike(tieneLike(asset));
        }
      } catch (error) {
        console.error("Error al obtener el asset:", error);
      }
    };
    fetchAsset();
  }, [id, asset]);
  

  
  // controlador para subir un comentario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comentario.trim()) {
      //Logica para subir el comentario
      
      setComentario('');
    }
  };
  

  const tieneValoracion = (userId) => {
    const valor = asset.valoracion.find(([id]) => id === userId);
    return valor ? valor[1] : null;
  };
  
  const tieneLike = (comentario) => {
    return comentario.likes?.includes(usuario._id);
  };

  const textareaRef = useRef(null);
  
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 5*20)}px`; // máx 200px
    }
  }


  if (!asset) return <p>Error al cargar el asset</p>;

  return (
    <>
    <div className="detalles-asset">
      <div className='izquierda'>
        <img className='imgPrincipal' src={imgPrincipal} alt="Imagen principal" />
        <div className="galeria">
          {asset.imagenes.map((img, i) => (
            <img key={i} src={img} onClick={() => setImgPrincipal(img)}/>
          ))}
        </div>
        <div className='stats'>
          <span><img src="/descarga.png" style={{height: "30px", width: "30px"}}/> ({asset.descargas})</span>
          <span><StarRating value={asset.valoracionNota} lugar={1}/> ({asset.valoracion.length})</span>
          <span> 
          <FaHeart
              onClick={() => {
                // Aquí podrías llamar a una función para gestionar el like, si lo necesitás
              }}
              style={{
                fontSize: "30px",          // Tamaño del icono
                cursor: "pointer",           // Cambia el cursor para indicar que es clickeable
                fill: haylike ? "red" : "gray" // para el color del corazón
              }}
              />
              ({asset.likes.length})
            </span>
        </div>
        <h2>Etiquetas:</h2>
        <div className='etiquetas'>
          {asset.etiquetas.map((etiqueta, i) => (
            <span key={i}>{etiqueta}</span>
          ))}
        </div>
      </div>
      
      <div className="derecha">
        <h2 className='autor-detalles'>{asset.nombre}</h2>
        <hr style={{width: "100%"}}/>
        <div className='caja-detalles'>
          <h2>Información del autor</h2>
          <hr style={{width: "100%"}}/>
          <div className="autor-box">
            <span> <img src={asset.autor.imagenPerfil} alt="imagen del autor" style={{width: "45px", height:"45px", borderRadius: "50%", objectFit: "cover"}}/>{asset.autor.nombre}</span>
            <div className="separador"></div>
            <span><StarRating value={asset.autor.valoracionesNota} lugar={1}/> ({asset.autor.valoracionesNum})</span>
            <div className="separador"></div>
            <span>❤️({asset.autor.seguidos.length})</span>
          </div>
          <hr style={{width: "100%"}}/>
          <div className="autor-desc">
            <p>{asset.autor.informacionAutor}</p>
          </div>
        </div>
      </div>
    </div>

    <h2>Descripción</h2>
    <hr style={{width: "80%", margin: "auto"}}/>
    <div className="descripcion">
     <p>{asset.descripcion}</p>
    </div>

    <h2>Comentarios</h2>
    <hr style={{width: "80%", margin: "auto"}}/>
    <div className="comentarios">
      {/* El comentario que ponemos nosotros */}
      {console.log(asset)}
      <form onSubmit={handleSubmit}>
        <img src={usuario.imagenPerfil} alt='imagen de perfil' style={{width: "45px", height:"45px", borderRadius: "50%",  objectFit: "cover"}}></img>          
        <textarea
            type="text"
            ref={textareaRef}
            placeholder="Añade un comentario..."
            value={comentario}
            rows={1}
            onChange={(e) => {
              setComentario(e.target.value);
              autoResizeTextarea();
            }}
          />
        <button type='submit'>
          Enviar
        </button>
        </form> 
      {/* Los comentarios de los demás */}
      {/* En caso de que no hayan comentarios */}
      {asset.comentarios?.length === 0 && (
        <hr style={{ width: "100%", margin: "auto" }} />
      )}
      {/* En caso de que si los hayan */}
      {asset.comentarios?.map((comentario) => {
        const valor = tieneValoracion(comentario.usuario?._id);
        const leDioLike = tieneLike(comentario);

        return (
          <React.Fragment key={comentario._id}>
            <hr style={{ width: "100%", margin: "auto" }} />
            <div className="comentarios-otros">
            <img src={comentario.usuario?.imagenPerfil} alt="imagen de perfil" style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}/>
              <div className="comentario-contenido">
                <div className='contenido-comentario-nombre'>
                  <strong>{comentario.usuario?.nombre}</strong>
                  <p style={{ fontStyle: "italic" }}>
                    {valor !== null ? <StarRating value={valor} lugar={2}/> : "Sin valoración"}
                  </p>
                </div>
                <p>{comentario.texto}</p>
              </div>
              <FaHeart
              onClick={() => {
                // Aquí podrías llamar a una función para gestionar el like, si lo necesitás
              }}
              style={{
                fontSize: "35px",          // Tamaño del icono
                cursor: "pointer",           // Cambia el cursor para indicar que es clickeable
                fill: leDioLike ? "red" : "gray" // para el color del corazón
              }}
            />
            </div>
          </React.Fragment>
        );
      })}
    </div>
    </>
  );
}

export default DetallesAsset