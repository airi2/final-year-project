// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyC-UfbM36PDsfxBolLhnYo1QPsrPAJNq6U",
  authDomain: "employeema-53b43.firebaseapp.com",
  projectId:  "employeema-53b43" ,
  storageBucket: "employeema-53b43.appspot.com",
  messagingSenderId: "334146721623",
  appId: "1:334146721623:web:de32665f5a7a3786305012",
  measurementId: "G-CBWW0XYHB1 "
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//ini services
 export const db = getFirestore(app);



export const auth = getAuth()
export default app
