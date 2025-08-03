// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkKf4-q3yo1OemUIASOcSZzhIPeNhfG3c",
  authDomain: "ashwin-payment.firebaseapp.com",
  projectId: "ashwin-payment",
  storageBucket: "ashwin-payment.firebasestorage.app",
  messagingSenderId: "491680609404",
  appId: "1:491680609404:web:bda0adde2b8500a00945f9",
  measurementId: "G-5X0VMZ1WFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);