import React from 'react'
import AssetLista from '../components/AssetLista'

function Inicio() { 
  return (
    <>
    <div className='contenedorPrincipal'>
      <section className='contenedorTitulo'>
        <h1>Más populares</h1>
      </section>
      <div className='contenedor'>
        <h1 className='titulo2'>3D</h1>
        <div className='contenedor2'>
          <AssetLista className="lista" cantidad={6} categoria={'3D'}/>
        </div>
      </div>
      <div className='contenedor'>
        <h1 className='titulo2'>2D</h1>
        <div className='contenedor2'>
          <AssetLista cantidad={6} categoria={'2D'} />
        </div>
      </div>
       
      <div className='contenedor'>
        <h1 className='titulo2'>Audio</h1>
        <div className='contenedor2'>
          <AssetLista cantidad={6} categoria={'Audio'}/>
        </div>
      </div>
       
      <div className='contenedor'>
        <h1 className='titulo2'>Addons</h1>
        <div className='contenedor2'>
         <AssetLista cantidad={6} categoria={'Addons'}/>
        </div>
      </div>
     </div>
    </>
  )
}

export default Inicio