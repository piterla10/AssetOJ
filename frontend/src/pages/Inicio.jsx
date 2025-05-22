import React from 'react'
import AssetLista from '../components/AssetLista'

function Inicio() { 
  return (
    <>
    <div className='contenedorPrincipal'>
      <section className='contenedorTitulo'>
        <h1 className='tituloinicio'>Más populares</h1>
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
          <AssetLista  className="lista"  cantidad={6} categoria={'2D'} />
        </div>
      </div>
       
      <div className='contenedor'>
        <h1 className='titulo2'>Audio</h1>
        <div className='contenedor2'>
          <AssetLista  className="lista"  cantidad={6} categoria={'Audio'}/>
        </div>
      </div>
       
      <div className='contenedor'>
        <h1 className='titulo2'>Add-On</h1>
        <div className='contenedor2'>
          <AssetLista  className="lista"  cantidad={6} categoria={'Add-On'}/>
        </div>
      </div>
     </div>
    </>
  )
}

export default Inicio