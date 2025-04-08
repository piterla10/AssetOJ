import React, { useState,useEffect } from 'react';
import StarRating from '../components/estrellas';
const filtrosPorCategoria = {
  '3D': [
    'Animaciones',
    'Personajes',
    'Fondos',
    'Vehiculos',
    'Vegetacion',
    'GUI',
    'Animales',
    'Formas',
    'Accesorios',
  ],
  '2D': [
    'Personajes',
    'Fondos',
    'Fuentes',
    'Texturas y Materiales',
    'Vegetación',
    'GUI'
  ],
  'Audio': ['Ambiente', 'SonidoFX', 'Música'],
  'Add-On': ['Personajes', 'Fondos'],

};
const filtrosFecha = ['Todo', 'Hace 1 día', 'Hace 1 semana', 'Hace 1 mes', 'Hace 6 meses', 'Hace 1 año'];
const FiltrosPorCategoria = ({ categoria, onFilterChange }) => {
    const filtros = filtrosPorCategoria[categoria] || [];
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState('Todo');
    const [valoracionSeleccionada, setValoracionSeleccionada] = useState(0);
    useEffect(() => {
      onFilterChange({ filtrosSeleccionados, fechaSeleccionada, valoracionSeleccionada });
    }, [filtrosSeleccionados, fechaSeleccionada, valoracionSeleccionada]);
  
    const toggleFiltro = (filtro) => {
      const yaSeleccionado = filtrosSeleccionados.includes(filtro);
      const nuevos = yaSeleccionado
        ? filtrosSeleccionados.filter((f) => f !== filtro)
        : [...filtrosSeleccionados, filtro];
      setFiltrosSeleccionados(nuevos);
    };
  
    return (
      <div className="flex flex-col gap-6 p-4" style={{background:'#121130',width:'250px',padding:'5px 10px'}}>
        <div style={{background:'transparent',width:'fit-content',height:'fit-content',display:'flex',justifySelf:'end'}}>
            <button  style={{
                background: 'transparent',
                color: '#DB6D6D',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
            onClick={() => {
                // Restablecer los filtros
                setFiltrosSeleccionados([]);
                setFechaSeleccionada('Todo');
                setValoracionSeleccionada('0');
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}>Borrar Filtros</button>
        </div>
        {/* Checkboxes por categoría */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',padding:'10px'}}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontSize: '26px',marginLeft:'20px' }}>Etiquetas</h3>
            <div style={{display:'flex', fontSize:'16px',flexDirection:'column',justifyItems:'flex-start',alignItems:'flex-start',marginLeft:'30px'}}>
                {filtros.map((filtro) => (
                <label key={filtro} style={{margin:'4px'}}>
                    <input
                    type="checkbox"
                    checked={filtrosSeleccionados.includes(filtro)}
                    onChange={() => toggleFiltro(filtro)}
                    style={{width:'15px',height:'15px',marginRight:'5px'}}
                    />
                    <span style={{gap:'0px'}}>{filtro}</span>
                </label>
                ))}
            </div>
        </div>
        <hr></hr>
        { /* Por Valoración*/}
        <div  style={{display:'flex',flexDirection:'column',alignItems:'flex-start',padding:'10px'}}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontSize: '26px',marginLeft:'20px' }}>Valoración</h3>
            <div className="flex gap-1" style={{marginLeft:'40px'}}>
            {[1, 2, 3, 4, 5].map((valor) => (
                <span
                key={valor}
                onClick={() => setValoracionSeleccionada(valor)}
                className="cursor-pointer"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={valoracionSeleccionada >= valor ? 'gold' : 'gray'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="18"  // Aquí ajustamos el tamaño directamente
                    height="18"
                    className="transition-colors"
                >
                    <path d="M12 .587l3.668 7.571L24 9.423l-6 5.847 1.416 8.264L12 18.896 4.584 23.534 6 15.27 0 9.423l8.332-1.265z" />
                </svg>
                </span>
            ))}
            </div>
        </div>
        <hr></hr>
        {/* Radios por fecha */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',padding:'10px'}}>
          <h3 className="text-lg font-semibold mb-2" style={{fontSize:'26px', marginLeft:'20px'}}>Fechas</h3>
          <div style={{display:'flex', fontSize:'16px',flexDirection:'column',justifyItems:'flex-start',alignItems:'flex-start',marginLeft:'30px'}}>
            {filtrosFecha.map((fecha) => (
              <label key={fecha} style={{margin:'4px'}}>
                <input
                  type="radio"
                  name="fecha"
                  checked={fechaSeleccionada === fecha}
                  onChange={() => setFechaSeleccionada(fecha)}
                />
                <span>{fecha}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default FiltrosPorCategoria;