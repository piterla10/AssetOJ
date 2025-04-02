import axios from 'axios'

const API_URL = '/api/users/'


// Register user
const register = async (userData) => {
  const response = await axios.post('http://localhost:5000/api/usuarios', userData)
  console.log(userData);
  if (response.data) {
    localStorage.setItem('token',response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post('http://localhost:5000/api/login', userData)

  if (response.data) {
   
    localStorage.setItem('token',response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
}

const authService = {
  register,
  logout,
  login,
}

export default authService
