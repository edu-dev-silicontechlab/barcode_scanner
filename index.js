// Get the modal
const modal = document.getElementById("myModal");
modal.style.display = "none";

// Get the <span> element that closes the modal
const close = document.getElementsByClassName("close")[0];

const empName = document.getElementById("empName");
const degi = document.getElementById("degi");
const img = document.getElementById("img");
const barcode = document.getElementById("barcode");

const openModal = (modalData) => {
  setTimeout(() => {
    empName.innerHTML = `${modalData?.emp_name} (${modalData?.emp_id})`;
    img.src = modalData?.profile_img;
    barcode.src = modalData?.barcode;
    degi.innerHTML = modalData?.designation;
    modal.style.display = "block";
  }, 2000);
};

close.onclick = function () {
  modal.style.display = "none";
  window.location.reload();
};

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
addBtn.style.display = "none";

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
    const barcodeDetector = new BarcodeDetector();
    barcodeDetector
      .detect(bitmap)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          userData.find((ele) => {
            ele.id == barcode.rawValue
              ? openModal(ele)
              : alert("no user found");
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
    profile_img: "https://avatars.githubusercontent.com/u/30226045?s=263&v=4",
    emp_id: 497,
    designation: "Software Engineer",
    barcode:
      "https://qrcg-media.s3.eu-central-1.amazonaws.com/wp-content/uploads/2020/03/31114611/02-blog-barcode-structure.png",
  },
];
