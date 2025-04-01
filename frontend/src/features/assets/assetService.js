import axios from 'axios'

const API_URL = '/api/assets/'

// Register user
const getAssets = async (tipo) => {
  const response = await axios.get('http://localhost:5000/api/assets/'+tipo)
  console.log(response.data);

  return response.data
}

const assetService = {
    getAssets,
}

export default assetService
  