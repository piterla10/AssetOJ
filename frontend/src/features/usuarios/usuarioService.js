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
  console.log(response.data);

  return response.data
}
const obtenerUsuarios = async (email) => {
    const response = await axios.get('http://localhost:5000'+ API_URL, config)
    console.log(response.data);
  
    return response.data
}
const actualizarUsuario = async (id,body) => {
    const response = await axios.put('http://localhost:5000'+ API_URL + id, body, config)
    console.log(response.data);
  
    return response.data
}
const actualizarContrasena = async (id,body) => {
    const response = await axios.put('http://localhost:5000'+API_URL+'cambioPassword/'+id, body, config)
    console.log(response.data);
  
    return response.data
}
const usuarioService = {
    obtenerUsuarios,obtenerUsuario,actualizarUsuario,actualizarContrasena
}

export default usuarioService
  