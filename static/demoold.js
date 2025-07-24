// // DOM Elements
// const video = document.getElementById('video');
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const imagePreview = document.getElementById('imagePreview');
// const resultsDiv = document.getElementById('results');
// const modelInfoDiv = document.getElementById('modelInfo');
// const fileInput = document.getElementById('fileInput');
// const webcamBtn = document.getElementById('webcamBtn');
// const uploadBtn = document.getElementById('uploadBtn');
// const detectBtn = document.getElementById('detectBtn');
// const stopBtn = document.getElementById('stopBtn');

// // State variables
// let model = null;
// let isDetecting = false;
// let detectionInterval = null;
// let stream = null;

// // Initialize the model
// async function loadModel() {
//     try {
//         showLoadingMessage("Loading COCO-SSD model...");
//         model = await cocoSsd.load();
//         showSuccessMessage(`Model loaded! (${model.modelName})`);
//         console.log("Model loaded successfully");
//         enableDetectionControls();
//     } catch (err) {
//         showErrorMessage("Failed to load model");
//         console.error("Model loading error:", err);
//     }
// }

// // Start webcam
// async function startWebcam() {
//     try {
//         stopDetection();
        
//         stream = await navigator.mediaDevices.getUserMedia({ 
//             video: { 
//                 width: { ideal: 1280 },
//                 height: { ideal: 720 },
//                 facingMode: 'environment',
//                 frameRate: { ideal: 30 }
//             },
//             audio: false
//         });
        
//         video.srcObject = stream;
//         showElement(video);
//         hideElement(imagePreview);
//         hideElement(canvas);
        
//         video.onloadedmetadata = () => {
//             video.play();
//             resizeCanvasToVideo();
//         };
        
//         detectBtn.disabled = false;
//         stopBtn.disabled = false;
//     } catch (err) {
//         console.error("Webcam error:", err);
//         showErrorMessage("Could not access the webcam. Please check permissions.");
//     }
// }

// // Stop webcam
// function stopWebcam() {
//     if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//         stream = null;
//     }
//     hideElement(video);
// }

// // Detect objects in image/video
// async function detectObjects() {
//     if (!model) {
//         showErrorMessage("Model is still loading. Please wait...");
//         return;
//     }
    
//     try {
//         isDetecting = true;
//         clearResults();
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//         const imageElement = video.classList.contains('hidden') ? imagePreview : video;
//         resizeCanvasToMediaElement(imageElement);
        
//         ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
//         showElement(canvas);
        
//         const predictions = await model.detect(canvas);
//         displayResults(predictions);
//         drawBoxes(predictions);
//     } catch (err) {
//         console.error("Detection error:", err);
//         showErrorMessage("Error during object detection");
//     } finally {
//         isDetecting = false;
//     }
// }

// // Continuous detection for webcam
// function startContinuousDetection() {
//     if (isDetecting) return;
    
//     isDetecting = true;
//     detectionInterval = setInterval(async () => {
//         await detectObjects();
//     }, 1000); // Detect every second
// }

// // Stop continuous detection
// function stopDetection() {
//     isDetecting = false;
//     if (detectionInterval) {
//         clearInterval(detectionInterval);
//         detectionInterval = null;
//     }
//     hideElement(canvas);
// }

// // Display detection results
// function displayResults(predictions) {
//     resultsDiv.innerHTML = '';
    
//     if (predictions.length === 0) {
//         resultsDiv.innerHTML = 'div class="text-gray-400">No objects detected/div>';
//         return;
//     }
    
//     predictions.forEach(prediction => {
//         const confidence = Math.round(prediction.score * 100);
//         const bbox = prediction.bbox.map(Math.round).join(', ');
        
//         const resultItem = document.createElement('div');
//         resultItem.className = 'bg-gray-700 p-2 rounded mb-2';
//         resultItem.innerHTML = `
//             div class="flex justify-between items-center">
//                 span class="font-bold">${prediction.class}/span>
//                 span class="text-blue-300">${confidence}%/span>
//             /div>
//             div class="text-xs text-gray-400 mt-1">
//                 Coordinates: [${bbox}]
//             /div>
//             div class="w-full bg-gray-600 rounded-full h-1.5 mt-1">
//                 div class="bg-blue-500 h-1.5 rounded-full" style="width: ${confidence}%">/div>
//             /div>
//         `;
//         resultsDiv.appendChild(resultItem);
//     });
// }

// // Draw bounding boxes
// function drawBoxes(predictions) {
//     predictions.forEach(prediction => {
//         const [x, y, width, height] = prediction.bbox;
//         const confidence = Math.round(prediction.score * 100);
//         const label = `${prediction.class} ${confidence}%`;
        
//         // Draw box
//         ctx.strokeStyle = '#00FF00';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(x, y, width, height);
        
//         // Draw label background
//         ctx.fillStyle = '#00FF00';
//         const textWidth = ctx.measureText(label).width;
//         ctx.fillRect(x, y - 20, Math.max(textWidth + 10, width), 20);
        
//         // Draw text
//         ctx.fillStyle = '#000000';
//         ctx.font = '14px Arial';
//         ctx.fillText(label, x + 5, y - 5);
//     });
// }

// // Helper functions
// function resizeCanvasToVideo() {
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
// }

// function resizeCanvasToMediaElement(element) {
//     canvas.width = element.width || element.videoWidth;
//     canvas.height = element.height || element.videoHeight;
// }

// function showElement(element) {
//     element.classList.remove('hidden');
// }

// function hideElement(element) {
//     element.classList.add('hidden');
// }

// function clearResults() {
//     resultsDiv.innerHTML = '';
// }

// function showLoadingMessage(message) {
//     modelInfoDiv.textContent = message;
//     modelInfoDiv.className = 'text-sm text-yellow-300';
// }

// function showSuccessMessage(message) {
//     modelInfoDiv.textContent = message;
//     modelInfoDiv.className = 'text-sm text-green-300';
// }

// function showErrorMessage(message) {
//     modelInfoDiv.textContent = message;
//     modelInfoDiv.className = 'text-sm text-red-300';
// }

// function enableDetectionControls() {
//     webcamBtn.disabled = false;
//     uploadBtn.disabled = false;
// }

// // Event Listeners
// webcamBtn.addEventListener('click', async () => {
//     stopDetection();
//     stopWebcam();
//     await startWebcam();
// });

// uploadBtn.addEventListener('click', () => {
//     fileInput.click();
// });

// fileInput.addEventListener('change', (e) => {
//     stopDetection();
//     stopWebcam();
    
//     const file = e.target.files[0];
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//         imagePreview.src = event.target.result;
//         imagePreview.onload = () => {
//             showElement(imagePreview);
//             hideElement(canvas);
//             detectBtn.disabled = false;
//             stopBtn.disabled = false;
//         };
//     };
//     reader.readAsDataURL(file);
// });

// detectBtn.addEventListener('click', () => {
//     if (!video.classList.contains('hidden')) {
//         startContinuousDetection();
//     } else {
//         detectObjects();
//     }
// });

// stopBtn.addEventListener('click', () => {
//     stopDetection();
// });

// // Initialize
// document.addEventListener('DOMContentLoaded', () => {
//     // Disable buttons until model loads
//     webcamBtn.disabled = true;
//     uploadBtn.disabled = true;
//     detectBtn.disabled = true;
//     stopBtn.disabled = true;
    
//     loadModel();
// });


// 1. Object Information (Step 1)
// fetch("/predict-and-store", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ item_name: "rifle" })
// })

const resultsDiv = document.getElementById("results");
const modelInfoDiv = document.getElementById("model-info");


// fetch("http://127.0.0.1:8000/predict", {
//     method: "POST",
//     body: formData,
// })


// .then(response => response.json())
//   .then(data => {
//     // Show predictions
//   });
// .then(response => response.json())
// .then(data => {
//     console.log("Response from backend:", data);
// })
// .catch(error => {
//     console.error("Error connecting to backend:", error);
// });

// const objectInfo = {
//     person: {
//         description: "A human being. Commonly found in all environments.",
//         use: "Used for facial recognition, crowd analysis, etc."
//     },
//     Rifle: {
//                         "description": "Surveillance drone.",
//                         "use": "Aerial monitoring and reconnaissance.",
//                         "battery": "90 min flight time",
//                         "range": "10km",
//                         "quantity": 0,
//                         "price": "$2,500"
//     },
//     cat: {
//         description: "The CAT (Common Admission Test) exam is primarily used for admission to postgraduate management programs, particularly MBA programs, in India. It serves as a crucial entrance test for prestigious business schools like the Indian Institutes of Management (IIMs) and other top-tier B-schools."
//     },
//     screw1: {
//         description: "A screw is a small metal rod with a notch in the top that's used as a fastener. You can attach one piece of wood to another by rotating a screw through the two surfaces. A screw is similar to a nail, but instead of hammering it in, you turn it repeatedly with a screwdriver"
//     }, 


    
//     const objectInfo = {
// person: {
// description: "A human being. Commonly found in all environments.",
// use: "Used for facial recognition, crowd analysis, etc."
// },
// cat: {
// description: "Domesticated feline animal commonly kept as a pet.",
// use: "Used in pet detection, animal welfare monitoring, etc."
// },
// screw1: {
// description: "A small metal fastener with threads used in construction.",
// use: "Fastening materials like wood, metal, and plastic."
// },

    // Add more entries
// };

// 2. All DOM and detection code (Step 2 and your HTML’s <script> content)
// Example of displayResults() with object info

document.getElementById('uploadBtn').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

     const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    console.log("Backend data:", data); // Display predictions in the console or update the UI

     displayResults(data.results); // ✅ Show results on frontend
});

// const objectInfo = {
// "1-2 Rosca Fina": {
// description: "Half-inch fine thread screw, typically used for precise fastening applications.",
// use: "Used in automotive and machinery assemblies requiring fine threading.",
// material: "Steel",
// size: "1/2 inch",
// quantity: 0,
// price: "$0.15"
// },
// "1-4 Rosca Fina": {
// description: "Quarter-inch fine thread screw for lightweight precision fittings.",
// use: "Ideal for electronics, small machinery, and cabinetry.",
// material: "Stainless steel",
// size: "1/4 inch",
// quantity: 0,
// price: "$0.10"
// },
// "M16x2": {
// description: "Metric M16 screw with 2mm pitch, heavy-duty fastener.",
// use: "Used in heavy construction, industrial machinery, and infrastructure projects.",
// material: "Carbon steel",
// size: "M16 x 2mm",
// quantity: 0,
// price: "$0.30"
// },
// "M4x08": {
// description: "Metric M4 screw with 8mm length, common in small appliances.",
// use: "Ideal for assembling electronic enclosures, hardware brackets.",
// material: "Zinc-plated steel",
// size: "M4 x 8mm",
// quantity: 0,
// price: "$0.08"
// },
// "M5x08": {
// description: "Metric M5 screw with 8mm length, medium strength fastener.",
// use: "Used in robotics, mounts, and modular hardware systems.",
// material: "Stainless steel",
// size: "M5 x 8mm",
// quantity: 0,
// price: "$0.12"
// }
// };

const objectInfo = {
  "1-2 Rosca Fina": {
    description: "A fine-threaded screw typically used in precision assemblies.",
    use: "Electronics or small mechanical parts."
  },
  "1-4 Rosca Fina": {
    description: "A finer-threaded version of the quarter-inch screw.",
    use: "Used in machinery with delicate tolerances."
  },
  "M16x2": {
    description: "Metric bolt with 16mm diameter and 2mm thread pitch.",
    use: "Heavy industrial applications and structural fastening."
  },
  "M4x08": {
    description: "Metric screw of 4mm diameter and 8mm length.",
    use: "Used in electronics, casings, and panels."
  },
  "M5x08": {
    description: "Metric screw 5mm wide and 8mm long.",
    use: "Common for mechanical joints and enclosures."
  }
};


// function displayResults(predictions) {
//     resultsDiv.innerHTML = '';
 
//     if (predictions.length === 0) {
//         resultsDiv.innerHTML = '<div class="text-gray-400">No objects detected</div>';
//         modelInfoDiv.textContent = 'No object info available.';
//         return;
//     }

//     predictions.forEach(prediction => {
//         const resultItem = document.createElement('div');
//         resultItem.className = 'bg-gray-700 p-2 rounded';

//         const className = prediction.class;
//         const info = objectInfo[className];

//         resultItem.innerHTML = `
//             <div class="flex justify-between">
//                 <span class="font-bold">${className}</span>
//                 <span>${Math.round(prediction.score * 100)}%</span>
//             </div>
//             <div class="text-xs text-gray-400">
//                 Bounding box: [${prediction.bbox.map(Math.round).join(', ')}]
//             </div>
//             ${info ? `
//                 <div class="mt-2 text-sm text-gray-300">
//                     <strong>Description:</strong> ${info.description}<br>
//                     <strong>Use:</strong> ${info.use}
//                 </div>` : ''}
//         `;

//         resultsDiv.appendChild(resultItem);
//     });

function displayResults(predictions) {
    resultsDiv.innerHTML = '';

    if (!predictions || predictions.length === 0) {
        resultsDiv.innerHTML = '<div class="text-gray-400">No objects detected</div>';
        modelInfoDiv.textContent = 'No object info available.';
        return;
    }

    predictions.forEach(p => {
        const className = p.class;
        const confidence = Math.round(p.confidence * 100);
        const info = objectInfo[p.class] || {};

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'bg-gray-700 p-2 rounded';
        resultsDiv.innerHTML += `
            <div class="flex justify-between">
                <span class="font-bold">${className}</span>
                <span>${confidence}%</span>
            </div>
            <div class="text-xs text-gray-400">
                Bounding box: [${p.bbox.map(Math.round).join(', ')}]
            </div>
            ${info ? `
                <div class="mt-2 text-sm text-gray-300">
                    <strong>Description:</strong> ${info.description}<br>
                    <strong>Use:</strong> ${info.use}
                </div>` : ''}
        `;

        resultsDiv.appendChild(resultItem);
    });

    // 🟨 Show first object info in model panel
    const first = predictions[0];
    const firstInfo = objectInfo[first.class];
    modelInfoDiv.innerHTML = firstInfo ? `
        <strong>Detected Object:</strong> ${first.class}<br>
        <strong>Description:</strong> ${firstInfo.description}<br>
        <strong>Use:</strong> ${firstInfo.use}
    ` : `<strong>Detected Object:</strong> ${first.class}<br>No info found.`;
}


// async function loadModel() {
//     try {
//         modelInfoDiv.textContent = "Loading COCO-SSD model...";
//         model = await cocoSsd.load();
//         modelInfoDiv.innerHTML = `
//             <strong>Name:</strong> ${model.modelName}<br>
//             <strong>Type:</strong> COCO-SSD<br>
//             <strong>Description:</strong> Pre-trained model on 80 common objects (COCO dataset).<br>
//             <strong>Status:</strong> ✅ Model loaded and ready.
//         `;
//         console.log("Model loaded successfully");
//     } catch (err) {
//         modelInfoDiv.textContent = "Failed to load model";
//         console.error("Model loading error:", err);
//     }
// }

async function sendImageToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    console.log(data.results);
    // You can also draw boxes on the image here using canvas if needed
}

