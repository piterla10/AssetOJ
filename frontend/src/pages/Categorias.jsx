import { useState, useEffect,useRef  } from 'react';
import assetService from '../features/assets/assetService'; // Asegúrate de importar correctamente el service
import FiltrosPorCategoria from '../components/Filtros';
import AssetLista from '../components/AssetLista';
function Categorias() {
  const categorias = ['3D', '2D', 'Audio', 'Add-On'];
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('Todo');
  const [valoracionSeleccionada, setValoraciónSeleccionada] = useState('0');
  const [categoriaActiva, setCategoriaActiva] = useState('3D');
  const [assets, setAssets] = useState([]);
  const [cantidadAssets, setCantidadAssets] = useState(20);
  const [listaVisible, setListaVisible] = useState(false); // Controla si la lista está visible
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('Seleccionar'); // Valor por defecto
  const [resultadosVisible, setResultadosVisible] = useState(false); // Para "Resultados"
  const [cantidadAssetsTotal, setAssetsTotal] = useState(0); // Para "Resultados"
  const [paginasTotales, setPaginasTotales] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);
  const listaRef = useRef(null); // Referencia para la lista desplegable
  const toggleButtonRef = useRef(null);
  // Ref para el botón de resultados
  const resultadosListaRef = useRef(null);
  const resultadosToggleRef = useRef(null);

  // Función para mostrar u ocultar la lista
  const toggleLista = () => {
    setListaVisible(!listaVisible);
  };

  // Función para manejar la selección de un valor
  const handleSeleccionar = (valor) => {
    setOrdenSeleccionado(valor); // Cambia el valor seleccionado
    setListaVisible(false); // Cierra la lista al hacer una selección
  };

  const handleClickOutside = (event) => {
    const target = event.target;
  
    // Cerrar lista de "Ordenar Por"
    if (
      listaRef.current &&
      toggleButtonRef.current &&
      !listaRef.current.contains(target) &&
      !toggleButtonRef.current.contains(target)
    ) {
      setListaVisible(false);
    }
  
    // Cerrar lista de "Resultados"
    if (
      resultadosListaRef.current &&
      resultadosToggleRef.current &&
      !resultadosListaRef.current.contains(target) &&
      !resultadosToggleRef.current.contains(target)
    ) {
      setResultadosVisible(false);
    }
  };
  const handleCantidadTotal = (total) => {
    setAssetsTotal(total);
  };


  const handleCalculoPaginas = () => {
    const paginas = Math.ceil(cantidadAssetsTotal / cantidadAssets);
    setPaginasTotales(paginas);
  };
  useEffect(() => {
    // Solo al montar/desmontar
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (cantidadAssets > 0 && cantidadAssetsTotal > 0) {
      handleCalculoPaginas();
    }
  }, [cantidadAssets, cantidadAssetsTotal]);
  // Cargar los assets cuando la categoría activa cambia
  useEffect(() => {
    setAssets([]);
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
  }, [categoriaActiva]); 
  return (
    <>
      <div className='contenedorPadre'>
        {categorias.map((categoria) => (
          <div 
            key={categoria} 
            className={`contenedorHijo ${categoriaActiva === categoria ? 'activo' : ''}`}
            onClick={() => {
              setCategoriaActiva(categoria);
              setFiltrosSeleccionados(0); // Reiniciar filtros al cambiar categoría
              setValoraciónSeleccionada('0');
              setFechaSeleccionada('Todo');
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
          onFilterChange={({ filtrosSeleccionados, fechaSeleccionada,valoracionSeleccionada }) => {
            setFiltrosSeleccionados(filtrosSeleccionados);
            setFechaSeleccionada(fechaSeleccionada);
            setValoraciónSeleccionada(valoracionSeleccionada);
          }}
        />
      </div>
      )}
     
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px', alignItems:'center' }}>
        <div style={{justifySelf:'left', position:'absolute',left:'150px'}}>
          <h1 style={{ fontSize: '12px', margin:'0'}}>1 - {cantidadAssets} de {cantidadAssetsTotal} resultados</h1>
        </div>
         {/* Título Ordenar Por */}
        <h1 
          style={{ fontSize: '18px', margin:'0' }} 
        >
          Ordenar Por
        </h1>

        {/* Lista desplegable */}
        {listaVisible && (
          <ul
            ref={listaRef}
            style={{
              listStyleType: 'none',
              padding: '0',
              margin: '5px 0',
              border: '1px solid #ccc',
              position: 'absolute',
              marginTop:'200px',
              marginLeft:'140px',
              backgroundColor: '#252360',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              zIndex: '1000',
              width: '160px',
              cursor: 'pointer',
            }}
          >
            {['Popularidad', 'Descargas', 'Nombre', 'Likes'].map((valor) => (
              <li
                key={valor}
                onClick={() => handleSeleccionar(valor)}
                style={{
                  padding: '10px',
                  backgroundColor: ordenSeleccionado === valor ? '#DB6D6D' : 'transparent',
                  color: ordenSeleccionado == 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {valor}
              </li>
            ))}
          </ul>
        )}

        {/* Mostrar el valor seleccionado */}
        <div  ref={toggleButtonRef} onClick={toggleLista}  style={{marginLeft:'10px', padding:'5px 10px',marginTop:'3px', fontSize: '14px', fontWeight: 'bold', cursor:'pointer',background:'#252360'}}>
          {ordenSeleccionado}
        </div>
        <div style={{ marginLeft: '20px',  display: 'flex', alignItems:'center',gap:'10px' }}>
          <h1 style={{ fontSize: '18px', margin: '0' }}>Resultados</h1>

          <div
            ref={resultadosToggleRef}
            onClick={() => setResultadosVisible(!resultadosVisible)}
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#252360',
              padding: '8px 12px',
              cursor: 'pointer',
              marginTop: '5px',
              display: 'inline-block',
            }}
          >
            {cantidadAssets}
          </div>

          {resultadosVisible && (
            <ul
              ref={resultadosListaRef}
              style={{
                listStyleType: 'none',
                marginTop: '240px',
                marginLeft:'110px',
                padding: 0,
                backgroundColor: '#252360',
                border: '1px solid #ccc',
                position: 'absolute',
                zIndex: 1000,
                width: '80px',
              }}
            >
              {['10', '20', '30', '40', '50'].map((valor) => (
                <li
                  key={valor}
                  onClick={() => {
                    setCantidadAssets(Number(valor));
                    setResultadosVisible(false);
                  }}
                  style={{
                    padding: '10px',
                    backgroundColor: cantidadAssets === Number(valor) ? '#DB6D6D' : 'transparent',
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {valor}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='assetsContainer' style={{width:'70%', alignSelf:'center', marginTop:'10px',marginLeft:'10%'}}>
        <AssetLista cantidad={cantidadAssets} paginacion={paginaActual*cantidadAssets} valoracion={valoracionSeleccionada} categoria={categoriaActiva} etiquetas={filtrosSeleccionados} fecha={fechaSeleccionada} orden={ordenSeleccionado} cantidadTotal={handleCantidadTotal}></AssetLista>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          {/* Botón anterior */}
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 0))}
            disabled={paginaActual === 0}
            style={{
              padding: '8px 12px',
              backgroundColor: '#121130',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: paginaActual === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ←
          </button>

          {/* Página actual (mostramos +1 al usuario) */}
          <span style={{ alignSelf: 'center', fontWeight: 'bold', color: 'white' }}>
            Página {paginaActual + 1} de {paginasTotales}
          </span>

          {/* Botón siguiente */}
          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, paginasTotales - 1))}
            disabled={paginaActual === paginasTotales - 1}
            style={{
              padding: '8px 12px',
              backgroundColor: '#121130',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: paginaActual === paginasTotales - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}

export default Categorias;
