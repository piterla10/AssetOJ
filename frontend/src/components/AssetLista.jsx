import React from "react";
import AssetCarta from "./AssetCarta";

// en este componente se hace la llamada a la bd con la cantidad de 
const AssetLista = ({ cantidad, categoria }) => {
    // aquí se hará la llamada y posteriormente se filtrará con lo que necesitemos
    // const filteredAssets = assets.filter(asset => asset.categoria === categoria);
    //  {filteredAssets.map(asset => (
    //     <AssetCard asset={asset} />
    //   ))}
  return (
    <> 
      <div className="listaAssets">
       
      </div>
    </>
  );
};

export default AssetLista;
