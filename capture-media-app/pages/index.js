import React from "react";

export default function Home() {
  const capture = new Capture();

  return (
    <>
      <button onClick={capture.startCaptureMedia}>Start</button>
      <button onClick={capture.stopRecording}>End</button>
      <button onClick={capture.saveRecording}>Save</button>
      <video id="video"></video>
    </>
  );
}

class Capture extends React.Component {
  // コンストラクタ設定
  constructor(props) {
    super(props);
    this.videoElem = null;
    this.status = "init"; // 状況
    this.recorder = null; // 音声にアクセスする "MediaRecorder" のインスタンス
    this.audioData = []; // 入力された音声データ
    this.audioExtension = null; // 音声ファイルの拡張子
  }

  startCaptureMedia = () => {
    var displayMediaOptions = {
      video: true,
      audio: true,
    };

    try {
      navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((stream) => {
          this.videoElem = document.getElementById("video");
          this.videoElem.srcObject = stream;

          this.recorder = new MediaRecorder(stream, displayMediaOptions);
          console.log(this.recorder);
          this.status = "recording";
          this.audioData = [];
          this.recorder.start();

          this.recorder.addEventListener("dataavailable", (e) => {
            this.audioData.push(e.data);
            this.audioExtension = e.data.type;
          });

          this.recorder.addEventListener("stop", () => {
            console.log("stopRecording");
            const blob = new Blob(this.audioData, {
              type: "video/webm",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "test.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            this.status = "ready";
          });
          this.status = "ready";
        });
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  stopRecording = () => {
    this.recorder.stop();
  };
}
