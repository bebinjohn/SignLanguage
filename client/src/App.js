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



function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK

  const [model,setModel]=useState(null)

  const [camera,setCamera]=useState(false)
  const { speak } = useSpeechSynthesis();
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
       console.log(response)
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
        {
          camera?
          <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />:<div></div>
        }
        

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        {/* NEW STUFF */}

        {/* NEW STUFF */}
      </header>
    </div>
  );
}

export default App;
