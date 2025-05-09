import React, { useEffect, useState } from "react";
import AssetCarta from "./AssetCarta";
import assetService from "../features/assets/assetService";

// pasamos la cantidad de asset de cierta categoría que queremos mostrar, las etiquetas en caso de que queramos
// filtrarlos y lo mismo con la valoración y la fecha, en caso de que no nos pasen estos parámetros, obtendrán los
// valores que les asignamos debajo.
const AssetLista = ({ cantidad = null, categoria = null, datosUsuario = null, paginacion = null, etiquetas = [], valoracion = null, fecha = null, cantidadTotal, orden = null}) => {
  const [assets, setAssets] = useState([]);
  console.log(datosUsuario);
  // esta variable sirve para poner paginación en caso de que nos la hayan pasado
  const inicio = paginacion ? paginacion : 0;

  // para cargar los datos de la API
  useEffect(() => { 

    const fetchAssets = async () => {
      try {
        let data = [];
        let filteredAssets;
        if (datosUsuario && categoria) {
          filteredAssets = datosUsuario.filter(asset => asset.tipo === categoria);
          console.log(filteredAssets);
          cantidadTotal?.(filteredAssets.length);
        } else if(datosUsuario) {
          filteredAssets = datosUsuario;
          console.log(filteredAssets);
          cantidadTotal?.(filteredAssets.length);
        }else {
          data = await assetService.getAssets(categoria);
          filteredAssets = data.assets;
          cantidadTotal?.(filteredAssets.length);
        }

        // Validación de si los datos no son válidos
        if ((!data || !Array.isArray(data.assets)) && !datosUsuario) {
          setAssets([]);
          return;
        }

        // Filtrado de etiquetas si se pasan
        if (etiquetas.length > 0) {
          filteredAssets = filteredAssets.filter(asset =>
            etiquetas.every(tag => asset.etiquetas && asset.etiquetas.includes(tag))
          );
        }

        // Filtrado por valoración
        if (valoracion !== null && valoracion > 0) {
          const min = (valoracion - 1) + 0.01;
          const max = valoracion;
        
          // Si valoracion es 1, queremos que incluya desde 0 hasta 1
          const rangoMin = valoracion === 1 ? 0 : min;
          const rangoMax = max;
        
          filteredAssets = filteredAssets.filter(asset =>
            asset.valoracionNota >= rangoMin && asset.valoracionNota <= rangoMax
          );
        }

        // Filtrado por fecha
        if (fecha !== null) {
          const ahora = new Date();
          let fechaLimite;

          switch (fecha) {
            case 'Hace 1 día':
              fechaLimite = new Date();
              fechaLimite.setDate(ahora.getDate() - 1);
              break;
            case 'Hace 1 semana':
              fechaLimite = new Date();
              fechaLimite.setDate(ahora.getDate() - 7);
              break;
            case 'Hace 1 mes':
              fechaLimite = new Date();
              fechaLimite.setMonth(ahora.getMonth() - 1);
              break;
            case 'Hace 6 meses':
              fechaLimite = new Date();
              fechaLimite.setMonth(ahora.getMonth() - 6);
              break;
            case 'Hace 1 año':
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
        
             // Ordenamiento según la prop "orden"
             if (orden) {
               switch (orden) {
                 case 'Likes':
                    filteredAssets.sort((a, b) => b.likes - a.likes);
                   break;
     
                 case 'Nombre':
                   filteredAssets.sort((a, b) => a.nombre.localeCompare(b.nombre));
                   break;
     
                 case 'Descargas':
                   filteredAssets.sort((a, b) => b.descargas - a.descargas);
                   break;
     
                 case 'Popularidad':
                   const haceUnMes = new Date();
                   haceUnMes.setMonth(haceUnMes.getMonth() - 1);
     
                   filteredAssets = filteredAssets
                     .filter(asset => new Date(asset.fecha) >= haceUnMes)
                     .sort((a, b) => b.likes - a.likes);
                   break;
     
                 default:
                   break;
               }
             }
    
          // Filtrar los assets nulos o vacíos
        const validAssets = filteredAssets.filter(asset => asset != null && asset.nombre);
        setAssets(validAssets.slice(inicio, inicio + cantidad));

      } catch (error) {
        console.error("Error al obtener los assets:", error);
      }
    };

    fetchAssets(); // Llamada a la API
  }, [categoria, cantidad, JSON.stringify(etiquetas), datosUsuario, paginacion, valoracion, fecha, orden]);

  if (assets.length > 0) {
    return (
      <div className="listaAssets">
        {assets.map(asset => (
          <AssetCarta key={asset._id} asset={asset} />
        ))}
      </div>
    );
  } else {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        fontSize: "20px"
      }}>
        <p style={{ color: "white" }}>No hay assets disponibles.</p>
      </div>
    );
  }
};

export default AssetLista;
