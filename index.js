if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    // give complete path of sw.js file
    .register("https://edu-dev-silicontechlab.github.io/serviceWorker.js")
    .then(() => console.log("Service Worker Registered"));
}
let deferredPromt;
const addBtn = document.querySelector('.installApp')
addBtn.style.display = 'none'

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPromt = e;
    addBtn.style.display = 'block'

    addBtn.addEventListener('click', () => {
        addBtn.style.display = 'none';
        deferredPromt.prompt();
        deferredPromt.userChoice.then((choiceResult) => {
            if(choiceResult.outcome === 'accepted'){
                console.log('App is installing');
            }else{
                console.log('User dismissed the prompt');
            }
            deferredPromt = null;
        })
    })
})

navigator.mediaDevices.enumerateDevices().then((devices) => {
  console.log(JSON.stringify(devices));
  let id = devices
    .filter((device) => device.kind === "videoinput")
    .slice(-1)
    .pop().deviceId;
  let constrains = { video: { optional: [{ sourceId: id }] } };

  navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
    let capturer = new ImageCapture(stream.getVideoTracks()[0]);
    step(capturer);
  });
});

function step(capturer) {
  capturer.grabFrame().then((bitmap) => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.drawImage(
      bitmap,
      0,
      0,
      bitmap.width,
      bitmap.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    var barcodeDetector = new BarcodeDetector();
    barcodeDetector
      .detect(bitmap)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          userData.find((ele) => {
            ele.id === barcode.rawData
              ? (document.getElementById("barcodes").innerHTML = ele.name)
              : (document.getElementById("barcodes").innerHTML =
                  "No user found");
          });
        });
        step(capturer);
      })
      .catch((e) => {
        console.error(e);
        document.getElementById("barcodes").innerHTML = "None";
      });
  });
}

const userData = [
  {
    id: 123456,
    name: "Soumyajit Mohapatra",
    profile_img: "https://avatars.githubusercontent.com/u/30226045?s=64&v=4",
    emp_id: 497,
    Designation: "Software Engineer",
  },
];
