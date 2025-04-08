import React, { useState } from 'react';

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
  'Asset': ['Personajes', 'Fondos'],
};

const FiltrosPorCategoria = ({ categoria, onFilterChange }) => {
  const filtros = filtrosPorCategoria[categoria] || [];
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);

  const toggleFiltro = (filtro) => {
    const yaSeleccionado = filtrosSeleccionados.includes(filtro);
    const nuevosFiltros = yaSeleccionado
      ? filtrosSeleccionados.filter((f) => f !== filtro)
      : [...filtrosSeleccionados, filtro];

    setFiltrosSeleccionados(nuevosFiltros);
    onFilterChange(nuevosFiltros);
  };

  return (
    <div className="flex flex-wrap gap-3 px-4 py-2" style={{background:'#121130',width:'200px',padding:'10px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
    <h1 style={{fontSize:'28px'}}>Etiquetas</h1>
      {filtros.map((filtro) => (
        <label
          key={filtro}
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-2xl text-sm shadow transition-all border ${
            filtrosSeleccionados.includes(filtro)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <input
            type="checkbox"
            className="hidden"
            checked={filtrosSeleccionados.includes(filtro)}
            onChange={() => toggleFiltro(filtro)}
          />
          <span className="w-4 h-4 flex items-center justify-center border rounded bg-white">
            {filtrosSeleccionados.includes(filtro) && (
              <svg
                className="w-3 h-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          {filtro}
        </label>
      ))}
    </div>
  );
};

export default FiltrosPorCategoria;
