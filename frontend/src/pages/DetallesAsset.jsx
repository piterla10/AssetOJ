import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import assetService from '../features/assets/assetService';
import StarRating from '../components/estrellas';
import usuarioService from '../features/usuarios/usuarioService';
import comentariosService from '../features/comentarios/comentariosService';
import { FaHeart } from "react-icons/fa";

function DetallesAsset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [imgPrincipal, setImgPrincipal] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [comentario, setComentario] = useState('');
  const [haylike, setHayLike] = useState(false);
  const [valoracionUsuario, setValoracionUsuario] = useState(0);

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
        console.log(data.assets);
        setImgPrincipal(data.assets.imagenes[0]);
      } catch (error) {
        console.error("Error al obtener el asset:", error);
      }
    };
    fetchAsset();
  }, [id]);
  
  useEffect(() => {
    if (asset && usuario) {
      // para manejar el like del asset
      setHayLike(asset.likes.includes(usuario._id));

      // Para saber si el usuario ha valorado ya el asset: 
      const entrada = asset.valoracion.find(([id, _]) => {
        const idStr = typeof id === "string" ? id : id.$oid;
        return idStr === usuario._id;
      });
  
      setValoracionUsuario(entrada ? entrada[1] : null);
    }
  }, [asset, usuario]);  
  

  // controlador para la valoración de un asset
  const handleValoracion = async (nuevaValoracion) => {
    try {
      await assetService.putValoracionAsset({
        usuario: usuario._id, // o el objeto `usuario`, según cómo lo gestiones
        asset: id, // o asset.id si es el caso
        valoracion: nuevaValoracion,
      });
  
      // Refresca la valoración del asset si lo necesitas
      const data = await assetService.getAsset(id);
      setAsset(data.assets);
    } catch (error) {
      console.error("Error al valorar el asset", error);
    }
  };  
  
  // controlador para cambiar las descargas y tal
  const handleDescarga = async () => {
    try {
      await assetService.putDescarga({
        usuario: usuario._id, 
        asset: id, 
      });
  
      // Refresca las descargas del asset 
      const data = await assetService.getAsset(id);
      setAsset(data.assets);
    } catch (error) {
      console.error("Error al cambiar los datos al descargar el asset", error);
    }
  }

  // controlador para subir un comentario
  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
      if (comentario.trim()) {
        const data = {
          usuario: usuario._id,
          texto: comentario,
          asset: id
        }
        
        const respuesta = await comentariosService.postComentario(data);
        console.log("Comentario creado: ", respuesta);
        setComentario('');
        
        // para actualizar la lista de comentarios lo que hacemos es actualizar 
        // el propio asset que los contiene 
        const nuevoAsset = await assetService.getAsset(id);
        setAsset(nuevoAsset.assets)
      }
    }catch(error){
      console.error("Error al enviar el comentario: ", error);
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


  if (!asset) return <></>;

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
          <span>
            <img
              src="/descarga.png"
              onClick={async () => {
                try {
                  // 1) Hacemos fetch del recurso (asset.contenido es la URL directa)
                  const res = await fetch(asset.contenido);
                  if (!res.ok) throw new Error(`HTTP ${res.status}`);

                  // 2) Lo convertimos a Blob
                  const blob = await res.blob();

                  // 3) Creamos un objeto URL a partir del Blob
                  const blobUrl = window.URL.createObjectURL(blob);

                  // 4) Preparamos el nombre de descarga
                  let nombre = asset.nombreArchivo || 'archivo';
                  if (asset.extension === 'zip') {
                    nombre += '.zip';
                  }

                  // 5) Creamos y clickamos el <a>
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = nombre;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  // 6) Liberamos el blob URL
                  window.URL.revokeObjectURL(blobUrl);

                  // 7) Contamos la descarga
                  handleDescarga();
                } catch (err) {
                  console.error('Error descargando el asset:', err);
                  // aquí podrías mostrar un mensaje al usuario
                }
              }}
              style={{ height: 30, width: 30, cursor: 'pointer' }}
            />
            ({asset.descargas})
          </span>


          <span style={{position: "relative"}}>
            <StarRating 
              userValue={valoracionUsuario}
              value={asset.valoracionNota} 
              lugar={1} 
              editable={true}
              onChange={handleValoracion}/> 
            ({asset.valoracion.length})
          </span>
          <span> 
          <FaHeart
              onClick={async () => {
                // Actualización optimista para hacer los cambios visuales instantáneos
                const assetOriginal = asset;
                const nuevoEstadoLike = !haylike;
                const nuevosLikes = nuevoEstadoLike
                  ? [...asset.likes, usuario._id]
                  : asset.likes.filter(id => id !== usuario._id);
              
                setAsset({ ...asset, likes: nuevosLikes });
                setHayLike(nuevoEstadoLike);
              
                // Llamada real al backend
                try {
                  await assetService.putLikeAsset({ usuario: usuario._id, asset: id });
                } catch (error) {
                  console.error("Error al dar like:", error);
              
                  // En caso de fallo, revertimos el cambio local
                  setAsset(assetOriginal); 
                  setHayLike(!nuevoEstadoLike);
                }
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
          <Link
                   to={
                        asset.autor?._id === usuario._id
                          ? "/miperfil"
                          : `/OtroPerfil/${asset.autor?._id}`
                      }
              className="autor-link"
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor:"pointer", color: "inherit" }}
            >
              <img 
                src={asset.autor.imagenPerfil} 
                alt="imagen del autor" 
                style={{ width: "45px", height:"45px", borderRadius: "50%", objectFit: "cover" }}
              />
              <span>{asset.autor.nombre}</span>
            </Link>
            <div className="separador"></div>
            <span><StarRating value={asset.autor.valoracionesNota} lugar={1}/> ({asset.autor.valoracionesNum})</span>
            <div className="separador"></div>
            <span>❤️({asset.autor.seguidores.length})</span>
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
                    <Link 
                      to={
                        comentario.usuario?._id === usuario._id
                          ? "/miperfil"
                          : `/OtroPerfil/${comentario.usuario?._id}`
                      }
                    className="autor-link"
                    style={{ color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}
                  >
                  <strong>{comentario.usuario?.nombre}</strong>
                  </Link>
                  <p style={{ fontStyle: "italic" }}>
                    {valor !== null ? <StarRating value={valor} lugar={2}/> : "Sin valoración"}
                  </p>
                </div>
                <p>{comentario.texto}</p>
              </div>
              <FaHeart
              onClick={async () => {
                const assetOriginal = asset;
              
                // 1. Clonamos los comentarios para evitar mutaciones directas
                const nuevosComentarios = asset.comentarios.map(c => {
                  if (c._id === comentario._id) {
                    const yaTieneLike = c.likes.includes(usuario._id);
                    return {
                      ...c,
                      likes: yaTieneLike
                        ? c.likes.filter(id => id !== usuario._id)
                        : [...c.likes, usuario._id]
                    };
                  }
                  return c;
                });
              
                // 2. Actualizamos visualmente con el nuevo estado
                setAsset({ ...asset, comentarios: nuevosComentarios });
              
                try {
                  // 3. Llamamos al backend
                  await comentariosService.putLikeComentario({
                    usuario: usuario._id,
                    comentario: comentario._id
                  });
                } catch (error) {
                  console.error("Error al modificar like del comentario:", error);
                  // 4. Revertimos el estado si falla
                  setAsset(assetOriginal);
                }
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