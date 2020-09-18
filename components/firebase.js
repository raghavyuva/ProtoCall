import React from "react";
import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

var firebaseConfig = {
  apiKey: `${secrets.API_KEY}`,
  authDomain: "todo-413d6.firebaseapp.com",
  databaseURL: `${secrets.DATABASE_URL}`,
  projectId: "todo-413d6",
  storageBucket: `${secrets.STORAGE_BUCKET}`,
  messagingSenderId: "729915356936",
  appId: "1:729915356936:web:48839217ceec1fb77e1ebd",
  measurementId: "G-7B3FM75L82"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
