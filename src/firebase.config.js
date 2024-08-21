import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAaVxgpZUNiQ-BXNWEIYdQpZc0JMsoWnU4",
  authDomain: "docslot-70e76.firebaseapp.com",
  projectId: "docslot-70e76",
  storageBucket: "docslot-70e76.appspot.com",
  messagingSenderId: "646902611903",
  appId: "1:646902611903:web:4708dcc2e3dddcc16c6b0a",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);