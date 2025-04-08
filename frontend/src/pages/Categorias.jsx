import { useState, useEffect } from 'react';
import assetService from '../features/assets/assetService'; // Asegúrate de importar correctamente el service
import FiltrosPorCategoria from '../components/Filtros';

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
        <FiltrosPorCategoria 
          categoria={categoriaActiva} 
          onFilterChange={setFiltrosActivos} 
        />
      )}

      <div className='assetsContainer'>
        <ul>
          {assets.length > 0 ? (
            assets
              .filter((asset) => {
                // Lógica de filtrado si hay filtros activos
                if (filtrosActivos.length === 0) return true;
                return filtrosActivos.includes(asset.subcategoria); // O el campo que uses
              })
              .map((asset, index) => (
                <li key={index}>{asset.nombre}</li> // Asegúrate que `asset` tenga nombre o el campo que desees
              ))
          ) : (
            <p className='noAssets'>No hay assets disponibles o cargando...</p>
          )}
        </ul>
      </div>
    </>
  );
}

export default Categorias;
