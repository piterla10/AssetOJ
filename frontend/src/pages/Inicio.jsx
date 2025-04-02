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
      </div>
        <AssetLista cantidad={6} categoria={'3D'}/>
      <div className='heading'>
        <h1>2D</h1>
      </div>
        <AssetLista cantidad={6} categoria={'2D'} />
      <div className='heading'>
        <h1>Audio</h1>
      </div>
        <AssetLista cantidad={6} categoria={'Audio'}/>
      <div className='heading'>
        <h1>Addons</h1>
      </div>
        <AssetLista cantidad={6} categoria={'Addons'}/>
    </>
  )
}

export default Inicio