import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // useSelector sirve para acceder al estado global, en este caso de las variables entre corchetes
  const { user, isLoading, isError, isSuccess, message } = useSelector( 
    (state) => state.auth // state.auth sirve para referenciar de donde se cogen las variables locales, auth es el nombre dado en store.js
  )

  // función que se ejecuta cuando se monta el componente, es util en llamadas a API y en subscripciones y limpieza de efectos.
  useEffect(() => { 
    // El primer argumento: Es una función que contiene el código que quieres ejecutar como "efecto secundario". 
    // Este código se ejecuta después de que el componente se renderiza.
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset()) // función para ejecutar acciones del slice
    
    // Array de dependencias, si se pasa una lista de dependencias, el efecto se ejecutará cada vez que cambien esas dependencias.
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }

    dispatch(login(userData)) // función para ejecutar acciones del slice
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
    <div className="login-container"> 
      <section className='heading'>
        <h1>
          Iniciar Sesión
        </h1>
      </section>
      
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Introduce tu email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Introduce tu contraseña'
              onChange={onChange}
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Confirmar
            </button>
          </div>
        </form>
      </section>
    </div>
  </>
  )
  
}

export default Login
