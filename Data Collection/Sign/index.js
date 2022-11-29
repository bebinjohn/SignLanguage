let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let stream;

let flag=true;



    camera_button.addEventListener('click', async function() {
        if(flag){
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;
            flag=false;
            for(let i=1;i<12222;i++)  {
                let j = 100000000;
                while(j>0){
                    j--;
                }
                console.log("hi")
            }
        }
        else{
            stream.getTracks().forEach(function(track) {
                track.stop();
              });
              flag=true;
              condition=false;
        }
    });







function takePhoto(){
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

  
    let data={
            id:1,
            image:image_data_url
        }

    fetch("http://127.0.0.1:5000",{
        method:"POST",
        body:JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
}
    }).then(e=>alert("Image send"))
}
