import React from 'react'
import './Sign.css'

import camera from '../../assets/camera.png'
import upload from '../../assets/upload.png'

export default function Sign({setCameraOpen,cameraOpen}) {

    const toogle=()=>{
            if(cameraOpen){
                setCameraOpen(false)
            }else{
                setCameraOpen(true)
            }
    }  
    
    return (
    <div className='sign-container'>
        <div style={cameraOpen?{border:"1.5px solid #1434A4"}:null} onClick={()=>toogle()} title='Detect Realtime' className='card-container'>
            <img src={camera}></img>
        </div>
        <div  title='upload Image' className='card-container'>
            <img src={upload}></img>
        </div>
    </div>
  )
}
