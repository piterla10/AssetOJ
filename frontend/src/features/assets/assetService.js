import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = '/api/assets/'
const token = localStorage.getItem('token'); // Recuperar el token almacenado

const config = {
    headers: {
        'x-token': token, 
        'Content-Type': 'application/json',
    },
};

const crearAsset = async (body,usuario) => {
  const response = await axios.post(apiUrl +'/api/assets/'+usuario._id,
    body,config)

  return response.data
}
const getAssets = async (tipo) => {
  const response = await axios.get(apiUrl + '/api/assets/'+tipo,config)

  return response.data
}
const getAssetsTodos = async () => {
    const response = await axios.get(apiUrl + '/api/assets/',config)
  
    return response.data
  }
const getAsset = async (tipo) => {
    const response = await axios.get(apiUrl + '/api/assets/obtenerUnAsset/'+tipo,config)
  
    return response.data
}

const putLikeAsset = async ({ usuario, asset }) => {
    const response = await axios.put(
      apiUrl + '/api/assets/like',
      { usuario, asset }, // <- body de la petición
      config              // <- cabeceras (como el token, si lo necesitas)
    );
  
    return response.data;
};

const putValoracionAsset = async ({ usuario, asset, valoracion}) => {
    const response = await axios.put(
     apiUrl + '/api/assets/valoracion',
      { usuario, asset, valoracion },
      config
    );
  
    return response.data;
};

const putDescarga = async ({ usuario, asset }) => {
    const response = await axios.put(
      apiUrl + '/api/assets/descarga',
      { usuario, asset }, // <- body de la petición
      config              // <- cabeceras (como el token, si lo necesitas)
    );
  
    return response.data;
};

const editarAsset = async ({id, asset, usuario}) =>{
  const response = await axios.put(
    apiUrl + '/api/assets/editarAsset/' + id,
    {asset, usuario},
    config
  );

  return response.data;
}

const assetService = {
    crearAsset,
    getAssets,
    getAsset,
    getAssetsTodos,
    putLikeAsset,
    putValoracionAsset,
    putDescarga,
    editarAsset
}

export default assetService
  