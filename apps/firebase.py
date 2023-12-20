from flask import Flask, render_template
import pyrebase

def home():
    config = {
      "apiKey": "AIzaSyDcRMwl-teS5Kg7-GcwbzRB-i2PuFbcur8",
      "authDomain": "webcapstone-dd29e.firebaseapp.com",
      "databaseURL": "https://webcapstone-dd29e-default-rtdb.firebaseio.com",
      "projectId": "webcapstone-dd29e",
      "storageBucket": "webcapstone-dd29e.appspot.com",
      "messagingSenderId": "263279001150",
      "appId": "1:263279001150:web:d32ce3baa249cc0e1bdb6f",
      "measurementId": "G-P8HQMGFYS1"
    };

    firebase = pyrebase.initialize_app(config)
    storage = firebase.storage()

    path_on_cloud = "gs://webcapstone-dd29e.appspot.com/result"

    url = storage.child(path_on_cloud).get_url(None)

    return render_template('index.html', url=url)