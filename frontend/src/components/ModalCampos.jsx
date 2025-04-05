import React, { useState, useEffect } from 'react';

// Modal Component
const ModalCampos = ({ show, onClose, onSave, values }) => {
  // Mantén el estado local para los valores a modificar
  const [newValue, setNewValue] = useState(values);

  // Usar useEffect para actualizar el estado cuando los valores cambian
  useEffect(() => {
    setNewValue(values);
  }, [values]);  // Solo actualizar cuando `values` cambie

  // Función para manejar el cambio en los campos
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewValue({
      ...newValue,
      [name]: value
    });
  };

  // Si el modal está cerrado, no renderizarlo
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevenir el comportamiento predeterminado del formulario
    onSave(newValue);    // Llamar a la función de guardar con los nuevos valores
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Valores</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Valor 1:</label>
            <input
              type="text"
              name="value1"
              value={newValue.value1 || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Valor 2:</label>
            <input
              type="text"
              name="value2"
              value={newValue.value2 || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit">
            Guardar
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCampos;
