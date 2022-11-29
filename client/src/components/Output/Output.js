import React from 'react'
import './Output.css'
import voiceImg from '../../assets/voice.png'
import '../Main/Sign.css'

export default function Output({word}) {


  

  return (
    <div className='Sign-Output'>
        <div >
          <div className='Result'>
                {word}
          </div>
        {/* <textarea style={{fontSize:"30px"}} value={word}></textarea> */}
        </div>
        {/* <div style={voice?{border:"1.5px solid #1434A4",marginTop:"10px"}:null} onClick={()=>toogle()} title="Activate Voice"className='card-container'>
            <img style={{padding:"17px" , width:"30px",height:"30px"}} src={voiceImg} alt="Image"></img>
        </div> */}
    </div>
  )
}
