import axios from 'axios'

const API_URL = '/api/assets/'
const token = localStorage.getItem('token'); // Recuperar el token almacenado

const config = {
  headers: {
    Authorization: `Bearer ${token}`, // Agregar el token en los headers
    'Content-Type': 'application/json',
  },
};
// Register user
const getAssets = async (tipo) => {
  const response = await axios.get('http://localhost:5000/api/assets/'+tipo,config)
  console.log(response.data);

  return response.data
}

const assetService = {
    getAssets,
}

export default assetService
  