import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// import { seedDatabase } from "../seed";

const config = {
  apiKey: "AIzaSyBSsUJTWfLXIG-GcaSjVpu0bD3xHKp6KMY",
  authDomain: "instagram-c067d.firebaseapp.com",
  projectId: "instagram-c067d",
  storageBucket: "instagram-c067d.appspot.com",
  messagingSenderId: "58001730176",
  appId: "1:58001730176:web:554a400fa40c29a8055465",
};

const Firebase = firebase.initializeApp(config);
const { FieldValue } = firebase.firestore;

// seedDatabase(Firebase);

export { Firebase, FieldValue };
