// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDYXkCVB04Gs8bQo9vt_BolTyTJZgUKsEk",
//   authDomain: "mrk-pay-app1.firebaseapp.com",
//   projectId: "mrk-pay-app1",
//   storageBucket: "mrk-pay-app1.appspot.com",
//   messagingSenderId: "554657058894",
//   appId: "1:554657058894:web:29406b8e1c7542eb00f31f",
//   measurementId: "G-V377VMZM2W",
// };
const firebaseConfig = {
  apiKey: "AIzaSyA07QDzldUaN-fH5C86pNde9QxQqu1-4BI",
  authDomain: "mrkpay-d3200.firebaseapp.com",
  projectId: "mrkpay-d3200",
  storageBucket: "mrkpay-d3200.appspot.com",
  messagingSenderId: "812611727342",
  appId: "1:812611727342:web:f2114cf3a4b48fd962e8ff",
  measurementId: "G-2ZBBJ06RLX",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
module.exports = { app, db };
