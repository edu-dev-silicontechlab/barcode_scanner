navigator.mediaDevices.enumerateDevices().then((devices) => {
	console.log(JSON.stringify(devices));
	let id = devices.filter((device) => device.kind === "videoinput").slice(-1).pop().deviceId;
  let constrains = {video: {optional: [{sourceId: id }]}};

  navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
    let capturer = new ImageCapture(stream.getVideoTracks()[0]);
  	step(capturer);
  });
});

function step(capturer) {
    capturer.grabFrame().then((bitmap) => {
      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, canvas.width, canvas.height);
      var barcodeDetector = new BarcodeDetector();
      barcodeDetector.detect(bitmap)
        .then(barcodes => {
          document.getElementById("barcodes").innerHTML = barcodes.map(barcode => barcode.rawValue).join(', ');
          step(capturer);
        })
        .catch((e) => {
          console.error(e);
          document.getElementById("barcodes").innerHTML = 'None';
        });
    });
}
