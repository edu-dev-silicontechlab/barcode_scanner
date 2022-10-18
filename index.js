// Get the modal
const modal = document.getElementById("myModal");
modal.style.display = "none";

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal

const empName = document.getElementById("empName");
const empId = document.getElementById("empId");
const degi = document.getElementById("degi");

const openModal = (modalData) => {
  const img = document.createElement("img");
  img.src = ele.profile_img;
  document.getElementById("img").appendChild(img);
  modal.style.display = "block";
  empName.innerHTML = modalData?.emp_name;
  empId.innerHTML = modalData?.emp_id;
  degi.innerHTML = modalData?.designation;
};

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    // give complete path of serviceWorker.js file
    .register("/barcode_scanner/serviceWorker.js", {
      scope: "/barcode_scanner/",
    })
    .then(() => console.log("Service Worker Registered"));
}
let deferredPromt;
const addBtn = document.querySelector(".installApp");
// addBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPromt = e;
  addBtn.style.display = "block";

  addBtn.addEventListener("click", () => {
    addBtn.style.display = "none";
    deferredPromt.prompt();
    deferredPromt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("App is installing");
      } else {
        console.log("User dismissed the prompt");
      }
      deferredPromt = null;
    });
  });
});

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
            ele.id == barcode.rawValue
              ? openModal(ele)
              : (empName.innerHTML = "No user Found");
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
    id: 53790547,
    emp_name: "Soumyajit Mohapatra",
    profile_img: "https://avatars.githubusercontent.com/u/30226045?s=64&v=4",
    emp_id: 497,
    designation: "Software Engineer",
  },
];
