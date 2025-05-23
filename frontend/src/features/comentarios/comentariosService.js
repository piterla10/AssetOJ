import axios from 'axios'
const apiUrl = process.env.API_URL;
const token = localStorage.getItem('token'); // Recuperar el token almacenado

const config = {
    headers: {
        'x-token': token, 
        'Content-Type': 'application/json',
    },
};

// Register user
const getComentarios = async () => {
  const response = await axios.get(apiUrl+'/api/comentarios/',config)

  return response.data;
}
const postComentario = async (data) => {
    const response = await axios.post(apiUrl+'/api/comentarios/', data ,config)

    return response.data;
}

const putLikeComentario = async ({ usuario, comentario }) => {
    const response = await axios.put(
      apiUrl+'/api/comentarios',
      { usuario, comentario }, // <- body de la petición
      config              // <- cabeceras (como el token, si lo necesitas)
    );
  
    return response.data;
};

const comentariosService = {
    getComentarios,
    postComentario,
    putLikeComentario
}

export default comentariosService
  