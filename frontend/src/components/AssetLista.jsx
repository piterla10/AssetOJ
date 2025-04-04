import React, { useEffect, useState } from "react";
import AssetCarta from "./AssetCarta";
import assetService from "../features/assets/assetService";

// pasamos la cantidad de asset de cierta categoría que queremos mostrar, las etiquetas en caso de que queramos
// filtrarlos y lo mismo con la valoración y la fecha, en caso de que no nos pasen estos parámetros, obtendrán los
// valores que les asignamos debajo.
const AssetLista = ({ cantidad = null, categoria = null, datosUsuario = null, paginacion = null, etiquetas = [], valoracion = null, fecha = null }) => {
  const [assets, setAssets] = useState([]);
  
  // esta variable sirve para poner paginación en caso de que nos la hayan pasado
  const inicio = paginacion ? paginacion : 0;

  // para cargar los datos de la API
  useEffect(() => { 
    let isMounted = true;  // Flag para controlar el desmontaje del componente

    const fetchAssets = async () => {
      try {
        let data = [];
        if (datosUsuario) {
          data = datosUsuario;
        } else {
          data = await assetService.getAssets(categoria);
        }

        // Validación de si los datos no son válidos
        if (!data || !Array.isArray(data.assets)) {
          setAssets([]);
          return;
        }

        let filteredAssets = data.assets;

        // Filtrado de etiquetas si se pasan
        if (etiquetas.length > 0) {
          filteredAssets = filteredAssets.filter(asset =>
            etiquetas.every(tag => asset.etiquetas && asset.etiquetas.includes(tag))
          );
        }

        // Filtrado por valoración
        if (valoracion !== null) {
          filteredAssets = filteredAssets.filter(asset => 
            asset.valoracionNota === valoracion
          );
        }

        // Filtrado por fecha
        if (fecha !== null) {
          const ahora = new Date();
          let fechaLimite;

          switch (fecha) {
            case 1:
              fechaLimite = new Date();
              fechaLimite.setDate(ahora.getDate() - 1);
              break;
            case 2:
              fechaLimite = new Date();
              fechaLimite.setDate(ahora.getDate() - 7);
              break;
            case 3:
              fechaLimite = new Date();
              fechaLimite.setMonth(ahora.getMonth() - 1);
              break;
            case 4:
              fechaLimite = new Date();
              fechaLimite.setMonth(ahora.getMonth() - 6);
              break;
            case 5:
              fechaLimite = new Date();
              fechaLimite.setFullYear(ahora.getFullYear() - 1);
              break;
            default:
              fechaLimite = null;
          }

          if (fechaLimite) {
            filteredAssets = filteredAssets.filter(asset => 
              new Date(asset.fecha) >= fechaLimite
            );
          }
        }

        // Solo actualizamos el estado si el componente sigue montado
        if (isMounted) {
          // Filtrar los assets nulos o vacíos
          const validAssets = filteredAssets.filter(asset => asset != null && asset.nombre);
          setAssets(validAssets.slice(inicio, inicio + cantidad));
        }
      } catch (error) {
        console.error("Error al obtener los assets:", error);
        if (isMounted) {
          setAssets([]);
        }
      }
    };

    fetchAssets(); // Llamada a la API

    return () => {
      isMounted = false; // Limpiar el flag cuando el componente se desmonte
    };
  }, [categoria, cantidad, JSON.stringify(etiquetas), datosUsuario]);

  console.log(assets); // Para depuración

  return ( 
    <div className="listaAssets">
      {/* Mostrar los assets o un mensaje si no hay disponibles */}
      {assets.length > 0 ? (
        assets.map(asset => (
          <AssetCarta key={asset._id} asset={asset} />
        ))
      ) : (
        <p>No hay assets disponibles.</p>
      )}
    </div>
  );
};

export default AssetLista;
