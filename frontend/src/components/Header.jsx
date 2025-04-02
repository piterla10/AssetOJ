import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { useState } from "react";
function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState("");

  // Manejar cambios en el input
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Redirigir al hacer la búsqueda
  const handleSearch = (e) => {
    e.preventDefault(); // Evita el recargo de la página
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>
          <img src='/Logo_con_fondo_mas_letras.png' alt='AssetsOJ' className="logo"/>
        </Link>
      </div>
      <div className='enlacesPaginas'>
        {user && (
          <>  
          <div className='enlace'>
            <Link to='/SubirAsset'>Subir Asset</Link>
          </div>
          <div className="separador"></div> 
          <div className='enlace'>
            <Link to='/Siguiendo'>Siguiendo</Link>
          </div>
          <div className="separador"></div> 
          </>
        )}
        <div className='enlace'>
          <Link to='/Categorias'>Categorías</Link>
        </div>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit">Buscar</button>
      </form>
      <ul>
        {user ? (
          <li>
            {/* <button className='btn-header' onClick={onLogout}>
                Logout
              </button> */}
            <div className='logo'>
              <Link to='/MiPerfil'>
                <img src="https://lh3.googleusercontent.com/d/1HnpfJ7K0A1cLf1wNGZIWP__4riQb85f9"  className="logoPerfil" alt="Imagen del proyecto"/>
              </Link>
            </div>
          </li>
        ) : (
          <>
           <li>
            <button className="btn-header">
              <Link to='/login'>Login</Link>
            </button>
           </li>
           <li>
            <button className="btn-header">
              <Link to='/registro'>Registro</Link>
            </button>
           </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header
