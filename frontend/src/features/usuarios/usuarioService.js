import axios from 'axios'

const API_URL = '/api/usuarios/'
const token = localStorage.getItem('token'); // Recuperar el token almacenado

const config = {
  headers: {
    Authorization: `Bearer ${token}`, // Agregar el token en los headers
    'Content-Type': 'application/json',
  },
};
// Register user
const obtenerUsuario = async (email) => {
  const response = await axios.get('http://localhost:5000'+ API_URL + '/' + email, config)
  console.log(response.data);

  return response.data
}
const obtenerUsuarios = async (email) => {
    const response = await axios.get('http://localhost:5000'+ API_URL, config)
    console.log(response.data);
  
    return response.data
  }
  
const usuarioService = {
    obtenerUsuarios,obtenerUsuario
}

export default usuarioService
  