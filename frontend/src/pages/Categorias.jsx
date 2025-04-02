import { useState, useEffect } from 'react';
import assetService from '../features/assets/assetService'; // Asegúrate de importar correctamente el service


function Categorias() {
  const categorias = ['3D', '2D', 'Audio', 'Add-Ons'];
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
        {/* Iteramos sobre las categorías predefinidas */}
        {categorias.map((categoria) => (
          <div 
            key={categoria} 
            className={`contenedorHijo ${categoriaActiva === categoria ? 'activo' : ''}`}
            onClick={() => setCategoriaActiva(categoria)}
          >
            <h1 className='titulo'>{categoria}</h1>
          </div>
        ))}
      </div>
      
      <div className='assetsContainer'>
        <ul>
          {assets.length > 0 ? (
            assets.map((asset, index) => (
              <li key={index}>{asset}</li>
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
