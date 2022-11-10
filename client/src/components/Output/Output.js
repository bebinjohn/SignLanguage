import React from 'react'
import './Output.css'
import voice from '../../assets/voice.png'
import '../Main/Sign.css'

export default function Output() {
  return (
    <div className='Sign-Output'>
        <div >
        <textarea></textarea>
        </div>
        <div style={{marginTop:"10px"}}  title="Activate Voice"className='card-container'>
            <img style={{padding:"17px" , width:"30px",height:"30px"}} src={voice} alt="Image"></img>
        </div>
    </div>
  )
}
