// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANI-SvxqDpQHoVkLtK96WLR2JXr_yQE20",
  authDomain: "oleampoxscraper.firebaseapp.com",
  projectId: "oleampoxscraper",
  storageBucket: "oleampoxscraper.appspot.com",
  messagingSenderId: "47008034970",
  appId: "1:47008034970:web:782324d8a4950d3ce96f23",
  measurementId: "G-ZTZFPL3ZBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
module.exports = db;