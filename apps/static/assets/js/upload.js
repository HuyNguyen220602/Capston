// Your web app's Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcRMwl-teS5Kg7-GcwbzRB-i2PuFbcur8",
  authDomain: "webcapstone-dd29e.firebaseapp.com",
  databaseURL: "https://webcapstone-dd29e-default-rtdb.firebaseio.com",
  projectId: "webcapstone-dd29e",
  storageBucket: "webcapstone-dd29e.appspot.com",
  messagingSenderId: "263279001150",
  appId: "1:263279001150:web:d32ce3baa249cc0e1bdb6f",
  measurementId: "G-P8HQMGFYS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const storageRef = ref(storage, 'gs://webcapstone-dd29e.appspot.com/result/');

// Function to upload image
function uploadImage() {
  const storageRef = ref(storage, 'gs://webcapstone-dd29e.appspot.com/result/');
  const file = document.querySelector("#photo").files[0];
  const name = new Date() + "_" + file.name;
  const metadata = {
    contentType: file.type
  };
  const task = storageRef.child(name).put(file, metadata);
  task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      console.log(url);
      alert("Image Upload Successful");
      const image = document.querySelector("#image");
      image.src = url;
    });
}

// Webcam code

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');

const constraints = {
  audio: false,
  video: {
    width: 640, // Adjusted width
    height: 480 // Adjusted height
  }
};

// Start webcam
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);

    
  } catch (error) {
    console.log("Error accessing camera:", error);
  }
}

function handleStream(stream) {
  window.stream = stream;
  video.srcObject = stream;
}


var context = canvas.getContext('2d');

snap.addEventListener('click', function () {
  context.drawImage(video, 0, 0, 640, 480);
  var image = new Image();

  image.id = "pic";

  image.src = canvas.toDataURL("image/png");

  console.log(image.src);

  var button = document.createElement("button");

  button.textContent = "Upload Image";

  document.body.appendChild(button);

  button.onclick = function () {
    const storageRef = ref(storage);
    storageRef.child(new Date() + '-' + 'base64').putString(image.src, 'data_url')
      .then(function (snapshot) {
        console.log("Image Uploaded");
        alert("Image Uploaded");
      });
  }
});

handleStream();
init();
uploadImage();