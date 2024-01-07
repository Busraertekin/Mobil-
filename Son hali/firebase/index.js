// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuexBnkmYN8-wG9y4Sf_b8G_6JFNHQv5M",
  authDomain: "hoteldb-961a6.firebaseapp.com",
  projectId: "hoteldb-961a6",
  storageBucket: "hoteldb-961a6.appspot.com",
  messagingSenderId: "460315195715",
  appId: "1:460315195715:web:ede507b84aa9683442d7f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app);