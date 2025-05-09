import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Los slice son archivos que se crean para gestionar de manera global el estado de unas variables o funciones

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('usuario'))

const initialState = { // valores de base que tienen las variables globales 
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk( // createAsyncThunk es una función proporcionada por Redux Toolkit que facilita la creación de acciones asíncronas
  'auth/register', // Nombre de la acción (recomendado usar el nombre del slice)
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login user
export const login = createAsyncThunk(
  'auth/login', 
  async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { // reducers sirve para gestionar las acciones síncronas del slice
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  }, // extrareducers se utiliza para gestionar las acciones asíncronas, builder también es parte del toolkit
  extraReducers: (builder) => {
    builder // builder permite reaccionar a acciones asíncronas generadas por createAsyncThunk
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      // todos estos.rejected, .fulfilled y demás son acciones que ofrece el builder al usar createAsyncThunk()
      .addCase(register.rejected, (state, action) => { 
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

// reducer que se llamará de forma síncrona, los de addCase no se pasan porque ocurren conforme se produce la acción asíncrona
export const { reset } = authSlice.actions // .actions sirve para exportar funciones o reducers concretas del documento
export default authSlice.reducer // para el store.js
