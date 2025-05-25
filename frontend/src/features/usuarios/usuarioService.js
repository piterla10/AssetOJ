import axios from 'axios'

const API_URL = '/api/usuarios/'
const token = localStorage.getItem('token'); // Recuperar el token almacenado

const config = {
    headers: {
        'x-token': token, 
        'Content-Type': 'application/json',
    },
};

const obtenerUsuario = async (email) => {
  const response = await axios.get('http://localhost:5000'+ API_URL + email, config)

  return response.data
}

const seguirUsuario = async (body) => {
  const response = await axios.put('http://localhost:5000/api/usuarios/seguidos/seguir',body, config)


  return response.data
}
const DejarseguirUsuario = async (body) => {
  const response = await axios.put('http://localhost:5000/api/usuarios/seguidos/dejarSeguir',body, config)

  return response.data
}
const obtenerUsuarios = async (email) => {
    const response = await axios.get('http://localhost:5000'+ API_URL, config)
  
    return response.data
}
const actualizarUsuario = async (id,body) => {
    const response = await axios.put('http://localhost:5000'+ API_URL + id, body, config)
  
    return response.data
}
const actualizarContrasena = async (id,body) => {
    const response = await axios.put('http://localhost:5000'+API_URL+'cambioPassword/'+id, body, config)
  
    return response.data
}

const actualizarImagenPerfil = async (id,body) => {
    const response = await axios.put('http://localhost:5000'+API_URL+'cambioImagenPerfil/'+id, body, config)
  
    return response.data
}
const obtenerSeguidos = async (id) => {
    const response = await axios.get('http://localhost:5000'+ API_URL+'/obtenerSeguidos/'+id, config)
  
    return response.data
}

const usuarioService = {
    obtenerUsuarios,obtenerUsuario,actualizarUsuario,actualizarContrasena,actualizarImagenPerfil,obtenerSeguidos,seguirUsuario,DejarseguirUsuario
}

export default usuarioService
  