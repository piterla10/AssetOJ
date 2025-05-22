import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useState, useEffect } from "react";
import usuarioService from '../features/usuarios/usuarioService';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [usuario, setUsuario] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    const fetchUsuario = async () => {
      try {
        console.log(user);
        const usuarioData = await usuarioService.obtenerUsuario(user._id);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        setUsuario(null);
      }
    };
  
    if (user && user._id) {
      fetchUsuario();
    } else {
      setUsuario(null);
    }
  }, [user]);

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/Busqueda?q=${searchTerm}`);
    }
  };

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>
          <img src='/Logo_con_fondo_mas_letras.png' alt='AssetsOJ' className="logo" />
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
            <div className='logo'>
              <Link to='/MiPerfil'>
              
                {usuario && usuario.imagenPerfil ? (
                  <img src={usuario.imagenPerfil} className="logoPerfil" alt="Imagen del perfil" />
                ) : (
                  <FaUser className="logoPerfil" />
                )}
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
  );
}

export default Header;
