
import { initializeApp,getApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, logEvent } from "firebase/analytics"
import { getMessaging, onMessage } from "firebase/messaging";
//import firebase from "firebase/app";
const firebaseConfig =  initializeApp({
   


apiKey: "AIzaSyD_Eub_0yK8fx_ZuWvLTFu6S2bgVoYeB7M",
authDomain: "mern-4dbe9.firebaseapp.com",
projectId: "mern-4dbe9",
storageBucket: "mern-4dbe9.appspot.com",
messagingSenderId: "455005923505",
appId: "1:455005923505:web:e91b064422d11f2222da90"





});


let firebaseApp;
try {
    firebaseApp = getApp();
    console.log(
        'firebaseApp',
    )
} catch (e) {
  firebaseApp = initializeApp(firebaseConfig);
  console.log('firebaseApp', firebaseApp);
}



// Initialize Firebase
//export const app = initializeApp(firebaseConfig);
export const app = firebaseApp
export const storage = getStorage(app);
export const db = getFirestore();
export const auth = getAuth();



export const analytics = () => {
  if (typeof window !== "undefined") {
   //  return firebase.analytics()
    return getAnalytics(app)
  } else {
     return null
  }
}



 //export  const analytics = getAnalytics(app);


export {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
}



// const messaging = getMessaging();
// onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);
//   // ...
// });