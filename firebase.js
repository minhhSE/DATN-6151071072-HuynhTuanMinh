// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth,getReactNativePersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAg5a4Q6aaOuBXBysbaMfV9zMYZUptgiU",
  authDomain: "fir-auth-bf413.firebaseapp.com",
  projectId: "fir-auth-bf413",
  storageBucket: "fir-auth-bf413.appspot.com",
  messagingSenderId: "141197691272",
  appId: "1:141197691272:web:06ba32121782aa5803523d",
};



// Initialize Firebase
// export const FIREBASE_APP = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_DB = getFirestore(app);





