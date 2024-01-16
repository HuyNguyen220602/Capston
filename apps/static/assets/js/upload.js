// Your web app's Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getStorage, ref, listAll, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

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
const storageRef = ref(storage);
const imagesRef = ref(storage, 'result');

// Webcam code

    // Get DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const uploadButton = document.getElementById('upload');

const constraints = {
  audio: false,
  video: {
    width: 1080, // Adjusted width
    height: 720 // Adjusted height
  }
};

    // Get webcam stream and handle it
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleStream(stream);
      } catch (error) {
        console.log("Error accessing camera:", error);
      }
    }

    // Handle webcam stream
    function handleStream(stream) {
      window.stream = stream;
      video.srcObject = stream;
    }

 // Function to take a snapshot
 function takeSnapshot() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  alert('Snapshot taken successfully!');
}


// Function to upload image to Firebase Storage
async function uploadToFirebase() {
  const imageDataUrl = canvas.toDataURL('image/png');

  // Convert the data URL to a Blob
  const byteString = atob(imageDataUrl.split(',')[1]);
  const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });

  // Generate the file name with the counter
  const fileName = 'Result_'  + Date.now() + '.png';
  
  // Create a reference to the desired location in your storage bucket
  const imageRef = ref(storage, 'result/' + fileName);

  // Upload the image to Firebase Storage
  const metadata = {
    contentType: 'image/png'
  };

  const task = uploadBytesResumable(imageRef, blob, metadata);

  // Listen for state changes, errors, and completion of the upload.
  task
    .then(snapshot => getDownloadURL(snapshot.ref))
    .then(url => {
      console.log('File available at', url);
      alert('Image Upload Successful');
    })
    .catch(error => {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    });
}

// Add event listeners to the buttons
snapButton.addEventListener('click', takeSnapshot);
uploadButton.addEventListener('click', uploadToFirebase);

// Initialize the webcam and set up the click event for the snap button
init();
handleStream();