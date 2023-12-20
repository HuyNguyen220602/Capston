// Your web app's Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getStorage, ref, getMetadata , getDownloadURL,listAll } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
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

let totalImages = 0;

async function loadImages() {
    const storageRef = ref(storage, 'gs://webcapstone-dd29e.appspot.com/result/');

    try {
        const result = await listAll(storageRef);
        totalImages = result.items.length; // Set the total number of images

        // Loop through the images and populate the table rows
        for (let i = 0; i < totalImages; i++) {
            const imageRef = result.items[i];
            const metadata = await getMetadata(imageRef);

            // Create a new row
            const row = document.createElement('tr');
            row.className = 'imageRow topnav';
            row.dataset.index = i;

            // Populate the row with cells
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('td');
                cell.className = 'text-center';

                // Populate the cells with data
                switch (j) {
                    case 0:
                        cell.innerHTML = i + 1; // Adding 1 to convert zero-based index to 1-based ID
                        break;
                    case 1:
                        cell.innerHTML = metadata.name;
                        break;
                    case 2:
                        let date = new Date(metadata.timeCreated);
                        let hours = date.getHours();
                        let minutes = "0" + date.getMinutes();
                        let seconds = "0" + date.getSeconds();
                        let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                        cell.innerHTML = formattedTime;
                        break;
                    case 3:
                        const datePart = new Date(metadata.timeCreated).toISOString().split('T')[0];
                        cell.innerHTML = datePart;
                        break;
                }

                // Add the cell to the row
                row.appendChild(cell);
            }

            // Add a click event listener to each row to show the corresponding image
            row.addEventListener('click', () => showImage(i));

            // Add a click event listener to toggle the highlighting effect
            row.addEventListener('click', () => toggleHighlight(row));

            // Add the row to the table body
            document.querySelector('tbody').appendChild(row);
        }
    } catch (error) {
        console.error(error.message);
    }
}

function toggleHighlight(row) {
    // Add the 'highlighted' class
    row.classList.add('highlighted');

    // Remove the 'highlighted' class after 30 seconds
    setTimeout(() => {
        row.classList.remove('highlighted');
    }, 100); // 30 seconds in milliseconds
}

var modal = document.getElementById("myModal");
var modalImg = document.getElementById("img01");
var span = document.querySelector("#myModal .close");

async function showImage(index) {
    // Fetch and display the corresponding image when a row is clicked
    const storageRef = ref(storage, 'gs://webcapstone-dd29e.appspot.com/result/');
    const result = await listAll(storageRef);
    const imageRef = result.items[index];
    const url = await getDownloadURL(imageRef);
    // Update UI to display the image
    const img = document.getElementById('image');
    
    img.setAttribute('src', url);

    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
    }
}

span.onclick = function() { 
    console.log("Close button clicked");
    modal.style.display = "none";
};

window.onload = async function() {
    // Load information for the first 5 images initially
    await loadImages();
};