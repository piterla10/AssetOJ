import axios from 'axios'

const API_URL = '/api/assets/'
const token = localStorage.getItem('token'); // Recuperar el token almacenado

const config = {
    headers: {
        'x-token': token, 
        'Content-Type': 'application/json',
    },
};

// Register user
const getAssets = async (tipo) => {
  const response = await axios.get('http://localhost:5000/api/assets/'+tipo,config)
  console.log(response.data);

  return response.data
}

const getAsset = async (tipo) => {
    const response = await axios.get('http://localhost:5000/api/assets/obtenerUnAsset/'+tipo,config)
    console.log(response.data);
  
    return response.data
}

const assetService = {
    getAssets,
    getAsset
}

export default assetService
  