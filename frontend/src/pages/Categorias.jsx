import { useState, useEffect } from 'react';
import assetService from '../features/assets/assetService'; // Asegúrate de importar correctamente el service
import FiltrosPorCategoria from '../components/Filtros';
import AssetLista from '../components/AssetLista';
function Categorias() {
  const categorias = ['3D', '2D', 'Audio', 'Add-Ons'];
  const [filtrosActivos, setFiltrosActivos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('3D');
  const [assets, setAssets] = useState([]);

  // Cargar los assets cuando la categoría activa cambia
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await assetService.getAssets(categoriaActiva);
        setAssets(data || []); // Aseguramos que siempre sea un array
      } catch (error) {
        console.error('Error al obtener los assets:', error);
        setAssets([]);
      }
    };
    
    fetchAssets(); // Llamada a la API
  }, [categoriaActiva]); // Se ejecuta cada vez que cambia la categoría activa
  
  return (
    <>
      <div className='contenedorPadre'>
        {categorias.map((categoria) => (
          <div 
            key={categoria} 
            className={`contenedorHijo ${categoriaActiva === categoria ? 'activo' : ''}`}
            onClick={() => {
              setCategoriaActiva(categoria);
              setFiltrosActivos([]); // Reiniciar filtros al cambiar categoría
            }}
          >
            <h1 className='titulo'>{categoria}</h1>
          </div>
        ))}
      </div>

      {/* Mostrar filtros solo si hay una categoría activa */}
      {categoriaActiva && (
      <div
        style={{
          position: 'absolute',
          top: '200px',
          right: '20px', // Se posiciona a la derecha
          zIndex: 1000, // Asegura que esté por encima si es necesario
          padding: '16px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <FiltrosPorCategoria 
          categoria={categoriaActiva} 
          onFilterChange={({ filtrosSeleccionados, fechaSeleccionada }) => {
            console.log('Filtrando por:', filtrosSeleccionados, fechaSeleccionada);
          }}
        />
      </div>
      )}
      <div className='assetsContainer'>
        <AssetLista  categoria={categoriaActiva}/>
      </div>
    </>
  );
}

export default Categorias;
