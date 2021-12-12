import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCH740P0nKG5xjjrJvxgQTRKlMQ_UWUFkw",
  authDomain: "recipes-app-mobil.firebaseapp.com",
  projectId: "recipes-app-mobil",
  storageBucket: "recipes-app-mobil.appspot.com",
  messagingSenderId: "313583679804",
  appId: "1:313583679804:web:d77eb9d8c931511db88639",
  measurementId: "G-RHKYFHD6Q1"
};


let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;