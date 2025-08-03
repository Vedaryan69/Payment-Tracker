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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
