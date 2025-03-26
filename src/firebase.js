// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD79xsyAAjjXhSdn_PC_8QXMNLqNTugnIM",
    authDomain: "proyecto-iot-a4661.firebaseapp.com",
    databaseURL: "https://proyecto-iot-a4661-default-rtdb.firebaseio.com",
    projectId: "proyecto-iot-a4661",
    storageBucket: "proyecto-iot-a4661.firebasestorage.app",
    messagingSenderId: "816695228532",
    appId: "1:816695228532:web:6e187b70cdea803908f921",
    measurementId: "G-CCYC3KSMLX"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };