// Example only: actual endpoints and tokens must match FastAPI backend logic

function uploadImage() {
  const input = document.getElementById("imageUpload");
  const file = input.files[0];
  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      document.getElementById("result").textContent = JSON.stringify(data, null, 2);
    })
    .catch(err => {
      console.error(err);
      alert("Upload failed");
    });
}
