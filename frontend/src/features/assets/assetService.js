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

  return response.data
}
const getAssetsTodos = async () => {
    const response = await axios.get('http://localhost:5000/api/assets/',config)
  
    return response.data
  }
const getAsset = async (tipo) => {
    const response = await axios.get('http://localhost:5000/api/assets/obtenerUnAsset/'+tipo,config)
  
    return response.data
}

const putLikeAsset = async ({ usuario, asset }) => {
    const response = await axios.put(
      'http://localhost:5000/api/assets/like',
      { usuario, asset }, // <- body de la petición
      config              // <- cabeceras (como el token, si lo necesitas)
    );
  
    return response.data;
};

const putValoracionAsset = async ({ usuario, asset, valoracion}) => {
    const response = await axios.put(
      'http://localhost:5000/api/assets/valoracion',
      { usuario, asset, valoracion },
      config
    );
  
    return response.data;
};

const assetService = {
    getAssets,
    getAsset,
    getAssetsTodos,
    putLikeAsset,
    putValoracionAsset
}

export default assetService
  