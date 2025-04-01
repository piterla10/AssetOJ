import React from 'react'
import AssetLista from '../components/AssetLista'

function Inicio() { 
  return (
    <>
      <section className='heading'>
        <h1>Más populares</h1>
      </section>
      <div className='heading'>
        <h1>3D</h1>
        <AssetLista cantidad={5} categoria={'3D'}/>
      </div>
      <div className='heading'>
        <h1>2D</h1>
      </div>
      <div className='heading'>
        <h1>Audio</h1>
      </div>
      <div className='heading'>
        <h1>Addons</h1>
      </div>
    </>
  )
}

export default Inicio