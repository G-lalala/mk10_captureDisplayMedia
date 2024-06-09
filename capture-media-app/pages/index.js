import React from 'react';

export default function Home() {
  const capture = new Capture();

  return (
    <>
      <button onClick={capture.testHello} id="hello">Hello</button>
      <button onClick={capture.startCaptureMedia}>Start</button>
      <button onClick={capture.stopRecording}>End</button>
      <button onClick={capture.saveRecording}>Save</button>
      <video id="video"></video>
    </>
  )
}

export function stopCapture() {

  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}

class Capture extends React.Component {
    // コンストラクタ設定
    constructor(props) {
      super(props);
      this.videoElem = null;
      this.status = 'init';   // 状況
      this.recorder = null;     // 音声にアクセスする "MediaRecorder" のインスタンス
      this.audioData = [];      // 入力された音声データ
      this.audioExtension = '';  // 音声ファイルの拡張子
    }
  
    testHello = () => {
      // console.log(videoElem)
      console.log(this.status)
    }

    startCaptureMedia = () => {
    
      var displayMediaOptions = {
        video: true,
        audio: true
      };
    
      try {
          navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
          .then(stream => {

            this.videoElem = document.getElementById("video");
            this.videoElem.srcObject = stream;
    
            this.recorder = new MediaRecorder(stream);

            this.recorder.addEventListener('dataavailable', e => {
    
                this.audioData.push(e.data);
                this.audioExtension = this.getExtension(e.data.type);
    
            });

            this.recorder.addEventListener('stop', () => {
    
              const audioBlob = new Blob(this.audioData);
              const url = URL.createObjectURL(audioBlob);
              let a = document.createElement('a');
              a.href = url;
              a.download = Math.floor(Date.now() / 1000) + this.audioExtension;
              document.body.appendChild(a);
              a.click();
    
            });
            this.status = 'ready';
        });
    
      } catch (err) {
          console.error("Error: " + err);
      }
    }

    // startRecording = () => {
    //   this.status = 'recording';
    //   this.audioData = [];
    //   this.recorder.start();
    // }

    stopRecording = () => {
    
        const audioBlob = new Blob(this.audioData);
        const url = URL.createObjectURL(audioBlob);
        let a = document.createElement('a');
        a.href = url;
        a.download = Math.floor(Date.now() / 1000) + this.audioExtension;
        document.body.appendChild(a);
        a.click();
        this.status = 'ready';
    }

    saveRecording = () => {
      console.log(this.recorder.active)
      // this.audioData.push(e.data);
      // this.audioExtension = this.getExtension(e.data.type);
    }
}
