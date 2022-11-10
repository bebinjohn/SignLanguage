
import React from 'react'
import img from '../../assets/Bebin1.jpg'
import './navbar.css'

export default function navbar() {
  return (
      <div  className='Navbar-container'>
      <img src={img} alt="Logo"/>
      <h2>HandVoice</h2>
      </div>
    
  )
}
