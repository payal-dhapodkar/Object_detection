// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
// const resultsDiv = document.getElementById("results");
// const modelInfoDiv = document.getElementById("modelInfo");
// const uploadInput = document.getElementById("uploadBtn");

// const objectInfo = {
//   "1-2 Rosca Fina": {
//     description: "Fine-threaded screw for precision assemblies.",
//     use: "Used in electronics or fine mechanics.",
//     price: "$0.10"
//   },
//   "1-4 Rosca Fina": {
//     description: "Quarter-inch fine thread screw.",
//     use: "Used in light metal construction.",
//     price: "$0.12"
//   },
//   "M16x2": {
//     description: "Heavy-duty metric screw.",
//     use: "Structural or industrial uses.",
//     price: "$0.50"
//   },
//   "M4x08": {
//     description: "Metric 4mm screw with 8mm length.",
//     use: "Used in panels and brackets.",
//     price: "$0.08"
//   },
//   "M5x08": {
//     description: "5mm screw, commonly used in mounts.",
//     use: "Used in robotics and enclosures.",
//     price: "$0.10"
//   }
// };

// uploadInput.addEventListener("change", async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const img = new Image();
//   const reader = new FileReader();
//   reader.onload = function (event) {
//     img.src = event.target.result;
//   };
//   reader.readAsDataURL(file);

//   img.onload = async function () {
//     canvas.width = img.width;
//     canvas.height = img.height;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(img, 0, 0);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/predict", {
//         method: "POST",
//         body: formData
//       });

//       const data = await response.json();
//       if (data.results && data.results.length > 0) {
//         drawDetections(data.results);
//         showResults(data.results);
//       } else {
//         resultsDiv.innerHTML = "<div>No objects detected.</div>";
//         modelInfoDiv.textContent = "No object info available.";
//       }
//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//     }
//   };
// });

// function drawDetections(predictions) {
//   predictions.forEach(pred => {
//     const [x1, y1, x2, y2] = pred.bbox;
//     ctx.strokeStyle = "#00FF00";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

//     ctx.fillStyle = "#00FF00";
//     ctx.font = "16px Arial";
//     ctx.fillText(`${pred.class} ${Math.round(pred.score * 100)}%`, x1 + 4, y1 + 18);
//   });
// }

// function showResults(predictions) {
//   resultsDiv.innerHTML = "";
//   predictions.forEach(pred => {
//     const info = objectInfo[pred.class] || {};
//     const div = document.createElement("div");
//     div.className = "bg-gray-800 p-2 rounded";
//     div.innerHTML = `
//       <div class="font-bold text-white">${pred.class} (${(pred.score * 100).toFixed(1)}%)</div>
//       <div class="text-gray-400">Box: [${pred.bbox.map(n => Math.round(n)).join(', ')}]</div>
//       ${info.description ? `<div>Description: ${info.description}</div>` : ''}
//       ${info.use ? `<div>Use: ${info.use}</div>` : ''}
//       ${info.price ? `<div>Price: ${info.price}</div>` : ''}
//     `;
//     resultsDiv.appendChild(div);
//   });

//   const first = predictions[0];
//   const firstInfo = objectInfo[first.class] || {};
//   modelInfoDiv.innerHTML = `
//     <div><strong>Detected:</strong> ${first.class}</div>
//     ${firstInfo.description ? `<div>Description: ${firstInfo.description}</div>` : ''}
//     ${firstInfo.use ? `<div>Use: ${firstInfo.use}</div>` : ''}
//     ${firstInfo.price ? `<div>Price: ${firstInfo.price}</div>` : ''}
//   `;
// }

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultsDiv = document.getElementById("results");
const modelInfoDiv = document.getElementById("modelInfo");
const uploadInput = document.getElementById("uploadBtn");
const webcamBtn = document.getElementById("startWebcamBtn");
const stopWebcamBtn = document.getElementById("stopWebcamBtn");
// const video = document.createElement("video");
const video = document.getElementById("webcam");

let webcamStream = null;

const objectInfo = {
  "1-2 Rosca Fina": {
    description: "Fine-threaded screw for precision assemblies.",
    use: "Used in electronics or fine mechanics.",
    price: "$0.10"
  },
  "1-4 Rosca Fina": {
    description: "Quarter-inch fine thread screw.",
    use: "Used in light metal construction.",
    price: "$0.12"
  },
  "M16x2": {
    description: "Heavy-duty metric screw.",
    use: "Structural or industrial uses.",
    price: "$0.50"
  },
  "M4x08": {
    description: "Metric 4mm screw with 8mm length.",
    use: "Used in panels and brackets.",
    price: "$0.08"
  },
  "M5x08": {
    description: "5mm screw, commonly used in mounts.",
    use: "Used in robotics and enclosures.",
    price: "$0.10"
  }
};

fetch("http://127.0.0.1:8000/predict", {
method: "POST",
body: formData,
headers: {
Authorization: "Bearer " + localStorage.getItem("token")
}
})
.then(response => response.json())
.then(data => {
console.log("Response from backend:", data);
displayResults(data.results); // 👈 this should be your function
})
.catch(error => {
console.error("Error:", error);
});

uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  const reader = new FileReader();
  reader.onload = function (event) {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);

  img.onload = async function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        drawDetections(data.results);
        showResults(data.results);
      } else {
        resultsDiv.innerHTML = "<div>No objects detected.</div>";
        modelInfoDiv.textContent = "No object info available.";
      }
    } catch (err) {
      console.error("Error fetching prediction:", err);
    }
  };
});

webcamBtn.addEventListener("click", async () => {
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = webcamStream;
    video.play();
    video.onloadedmetadata = () => {
    video.classList.remove("hidden");
    requestAnimationFrame(captureFrame);
  };
 } catch (err) {
    console.error("Error starting webcam:", err);
  }
});

stopWebcamBtn.addEventListener("click", () => {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
});

// function captureFrame() {
//   if (!webcamStream) return;
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   ctx.drawImage(video, 0, 0);

//   canvas.toBlob(async blob => {
//     const formData = new FormData();
//     formData.append("file", blob, "frame.jpg");
//     try {
//       const response = await fetch("http://127.0.0.1:8000/predict", {
//         method: "POST",
//         body: formData
//       });
//       const data = await response.json();
//       ctx.drawImage(video, 0, 0);
//       if (data.results && data.results.length > 0) {
//         drawDetections(data.results);
//         showResults(data.results);
//       }
//     } catch (err) {
//       console.error("Webcam detection failed:", err);
//     }
//     requestAnimationFrame(captureFrame);
//   }, "image/jpeg");
// }

function captureFrame() {
if (!webcamStream || video.videoWidth === 0 || video.videoHeight === 0) return;
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
ctx.drawImage(video, 0, 0);

canvas.toBlob(async (blob) => {
if (!blob) {
console.error("Failed to capture blob from canvas");
return;
}
const formData = new FormData();
formData.append("file", blob, "frame.jpg");

try {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    ctx.drawImage(video, 0, 0);  // redraw frame
    drawDetections(data.results);
    showResults(data.results);
  }
} catch (err) {
  console.error("Webcam detection failed:", err);
}

requestAnimationFrame(captureFrame);
}, "image/jpeg");
}


function drawDetections(predictions) {
  predictions.forEach(pred => {
    const [x1, y1, x2, y2] = pred.bbox;
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    ctx.fillStyle = "#00FF00";
    ctx.font = "16px Arial";
    ctx.fillText(`${pred.class} ${Math.round(pred.score * 100)}%`, x1 + 4, y1 + 18);
  });
}

function showResults(predictions) {
  resultsDiv.innerHTML = "";
  predictions.forEach(pred => {
    const info = objectInfo[pred.class] || {};
    const div = document.createElement("div");
    div.className = "bg-gray-800 p-2 rounded";
    div.innerHTML = `
      <div class="font-bold text-white">${pred.class} (${(pred.score * 100).toFixed(1)}%)</div>
      <div class="text-gray-400">Box: [${pred.bbox.map(n => Math.round(n)).join(', ')}]</div>
      ${info.description ? `<div>Description: ${info.description}</div>` : ''}
      ${info.use ? `<div>Use: ${info.use}</div>` : ''}
      ${info.price ? `<div>Price: ${info.price}</div>` : ''}
    `;
    resultsDiv.appendChild(div);
  });

  const first = predictions[0];
  const firstInfo = objectInfo[first.class] || {};
  modelInfoDiv.innerHTML = `
    <div><strong>Detected:</strong> ${first.class}</div>
    ${firstInfo.description ? `<div>Description: ${firstInfo.description}</div>` : ''}
    ${firstInfo.use ? `<div>Use: ${firstInfo.use}</div>` : ''}
    ${firstInfo.price ? `<div>Price: ${firstInfo.price}</div>` : ''}
  `;
}

// fetch("http://127.0.0.1:8000/predict", {
// method: "POST",
// body: formData,
// headers: {
// Authorization: "Bearer " + localStorage.getItem("token")
// }
// })
// .then(response => response.json())
// .then(data => {
// console.log("Response from backend:", data);
// displayResults(data.results); // 👈 this should be your function
// })
// .catch(error => {
// console.error("Error:", error);
// });

document.getElementById("uploadBtn").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Convert image to blob and send to /predict
            canvas.toBlob((blob) => {
                const formData = new FormData();
                formData.append("file", blob, file.name);
                fetch("http://127.0.0.1:8000/predict", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer YOUR_TOKEN_HERE"
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // show detection results
                });
            }, "image/jpeg");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.addEventListener("DOMContentLoaded", () => {
const uploadInput = document.getElementById("uploadBtn");
const imagePreview = document.getElementById("imagePreview");
const resultsContainer = document.getElementById("results");

uploadInput.addEventListener("change", async (event) => {
const file = event.target.files[0];
 if (!file) return;
 // Preview the image
const reader = new FileReader();
reader.onload = function (e) {
  imagePreview.src = e.target.result;
  imagePreview.classList.remove("hidden");
};
reader.readAsDataURL(file);

// Upload to FastAPI
const formData = new FormData();
formData.append("file", file);

try {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`
    },
    body: formData
  });

  const data = await response.json();
  console.log("Backend response:", data);

  if (data.results) {
    resultsContainer.innerHTML = JSON.stringify(data.results, null, 2);
  } else {
    resultsContainer.innerHTML = "<p>No objects detected.</p>";
  }
} catch (error) {
  console.error("Prediction error:", error);
  resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
}
});
});