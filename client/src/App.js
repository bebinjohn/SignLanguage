///////// NEW STUFF ADDED USE STATE
import React, { useRef, useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import * as tf from '@tensorflow/tfjs'
import * as handpose from "@tensorflow-models/handpose";
import axios from 'axios'
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";
import Navbar from "./components/Navbar/navbar";
import Sign from "./components/Main/Sign";
import Output from "./components/Output/Output";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK

  const [model,setModel]=useState(null)

  const [camera,setCamera]=useState(false)
  const [word,setWord]=useState("")

  const [voice,setVoice]=useState(false)
  const { speak } = useSpeechSynthesis();
  const [signImage, setSignImage] = useState("")
  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setModel(net)
    //  Loop and detect hands
  };



  const capturePhoto=()=>{
    const imageSrc = webcamRef.current.getScreenshot();
    if(imageSrc!==null){
      axios.post(" http://127.0.0.1:5000/",{
        id:1,
        image:imageSrc
      }).then(response=> {
       setWord(response.data)
       console.log(voice)
        
          speak({ text:response.data})

      
      }).catch(err=>console.log(err))
    }
    
  }


  const findResult=(base64)=>{
      if(base64!=null){
        setSignImage(base64)
        axios.post(" http://127.0.0.1:5000/",{
        id:1,
        image:base64
      }).then(response=> {
       setWord(response.data)
        speak({ text:response.data})
      }).catch(err=>console.log(err))
      }
  }

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
          capturePhoto()
      }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };


  const handleInput=()=>{
    var file = document.getElementById("selectImage").files[0];
    getBase64(file)
  }

 const getBase64=(file)=>{
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
    findResult(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }
  

  useEffect(()=>{runHandpose()},[]);

  useEffect(()=>{
    if(camera&&model!==null){
      setInterval(() => {
        detect(model);
      }, 1000);
    }  
  },[model,camera])

  return (
    <div >
    <header>
      <Navbar/>
      <Sign cameraOpen={camera} setCameraOpen={setCamera}/>

      <div className="SignLang_container">
      {
          camera?
          <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "50%",
            marginRight: "auto",
            textAlign:"center",
            left: 0,
            right: 0,
            zindex: 9,
            width: 500,
            height: 400,
            borderRadius:10
          }}
        />:signImage!==""?<div><img src={signImage} style={{
          position: "absolute",
          marginLeft: "50%",
          marginRight: "auto",
          textAlign:"center",
          left: 0,
          right: 0,
          zindex: 9,
          width: 500,
          height: 400,
          borderRadius:10
        }}></img></div>:<div></div>
        }
        

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft:"50%",
            marginRight: "auto",
            left: "10px",
            textAlign:"center",
            right: 0,
            zindex: 9,
            width: 500,
            height: 400,
            borderRadius:10
          }}
        />
           <Output voice={voice} setVoice={setVoice} word={word}/>
      </div>

      <div>
      <input id='selectImage' hidden type="file" onChange={()=>handleInput()} />
      </div>
   
        {/* NEW STUFF */}

        {/* NEW STUFF */}
      </header>
    </div>
  );
}

export default App;
