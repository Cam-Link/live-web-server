"use strict";


import { ip } from './ip.mjs';



let videos = document.querySelector('.videos');


let baseHost = "https://" + ip;
let port = "5800";



function send(method,address,data={}, vid = "0", blob="0"){

  let host = baseHost + ":" + port + "/requester/";

  let request;

  let info = {
    'method':method,
    'address':address,
    'data':data,
    'vid':vid,
    'blob':blob,
  };
  
  request = new Request(host,{
    method:"POST",
    mode: 'no-cors',
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(info),
  });
  
  
  // console.log(host);

  return fetch(request)
  .then(response=>{
    if (!response.ok){
      throw new Error("unexpected error!");
    }

    if (vid == "1"){

      const contentType = response.headers.get('Content-Type');

      if (contentType.includes('application/json')){
        return response.json();
      }


      return response.arrayBuffer();
    }

    return response.json();
  })
  .then(response=>{

    return response;
  })
  .catch(error=>{
    console.log(error);
  })

}


// const mimeCodec = 'video/webm; codecs="vp8"';

// let mediaSource;

// let currentSourceBuffer;



// document.addEventListener('DOMContentLoaded', function() {
  
//   send("GET","live/refresh/")
//   .then(response=>{
//     console.log(response);
//     if (response['msg'] == "success"){
//       let lives = response['live'];

//       lives.forEach(live => {
        
//         const video = document.createElement('video');
//         video.classList.add('video');
//         video.autoplay = true;
//         video.loop = true;

//         send("GET","live/play/",{"uid":live,"cid":0},"1")
//         .then(response=>{
//           // video.src = URL.createObjectURL(response);
//           // videos.appendChild(video);
          
          

          
//           if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
//             mediaSource = new MediaSource;


//             video.src = URL.createObjectURL(mediaSource);

//             video.onloadedmetadata = function(){
//               video.play();
//             };

//             mediaSource.addEventListener("sourceopen", sourceopen);

//           }else{
//             console.error("Unsupported MIME type or codec: ", mimeCodec);
//           }

//           function sourceopen(){
            
//             currentSourceBuffer =   mediaSource.addSourceBuffer(mimeCodec);


//             currentSourceBuffer.addEventListener('updateend', function (_) {
//               loader();

//             });

//             loader();


//           }


//         });

        



//       });
//     }
//   })
// });


// function loader(){
//   send("GET","screenshare/play/",{}, "1")
//   .then(data=>{
//     if (!data['msg']){
//       currentSourceBuffer.appendBuffer(data);
//     }else{
//       console.log('none_');
//       // setTimeout(()=>{
//       //   loader();
//       // },1600);
//     }
    
//   });
// }



document.addEventListener('DOMContentLoaded', function() {
  send("GET","live/refresh/")
  .then(response=>{
    if (response['msg'] == "success"){
      let lives = response['live'];

      lives.forEach(live => {

        
        let html = `
          <a href="https://${ip}:${port}/stream/${live}"><div class="video"> autoplay></div></a>
        `;

        videos.insertAdjacentHTML('beforeend', html);

      });
    }

  });

});