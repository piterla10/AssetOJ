import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Inicio from './pages/Inicio'
import Register from './pages/Register'
import Busqueda from './pages/Busqueda'
import Categorias from './pages/Categorias'
import DetallesAsset from './pages/DetallesAsset'
import EditarAsset from './pages/EditarAsset'
import MiPerfil from './pages/MiPerfil'
import OtroPerfil from './pages/OtroPerfil'
import Siguiendo from './pages/Siguiendo'
import SubirAsset from './pages/SubirAsset'
import Login from './pages/Login'

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registro' element={<Register />} />
            <Route path='/Busqueda' element={<Busqueda />} />
            <Route path='/Categorias' element={<Categorias />} />
            <Route path='/DetallesAsset/:id' element={<DetallesAsset />} />
            <Route path='/EditarAsset' element={<EditarAsset />} />
            <Route path='/MiPerfil' element={<MiPerfil />} />
            <Route path='/OtroPerfil' element={<OtroPerfil />} />
            <Route path='/Siguiendo' element={<Siguiendo />} />
            <Route path='/SubirAsset' element={<SubirAsset />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
