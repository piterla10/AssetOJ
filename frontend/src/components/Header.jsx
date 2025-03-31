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
          <img src='/Logo_con_fondo_mas_letras.png' alt='AssetsOJ' class="logo"/>
        </Link>
      </div>
      <div className='enlacesPaginas'>
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
            <button className='btn' onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
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
