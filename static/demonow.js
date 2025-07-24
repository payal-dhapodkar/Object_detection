document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("uploadBtn");
  const imagePreview = document.getElementById("imagePreview");
  const predictBtn = document.getElementById("predictBtn");
  const resultsBox = document.getElementById("results");

  let currentFile = null;

  uploadBtn.addEventListener("change", () => {
    const file = uploadBtn.files[0];
    if (!file) return;
    currentFile = file;

    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  predictBtn.addEventListener("click", async () => {
    if (!currentFile) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", currentFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      resultsBox.textContent = JSON.stringify(data.results || data, null, 2);
    } catch (err) {
      console.error(err);
      resultsBox.textContent = "❌ Error connecting to backend.";
    }
  });
});
