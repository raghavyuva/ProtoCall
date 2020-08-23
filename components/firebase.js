import React from "react";
import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3e-BDWnw6SYvPfq5_0MUZvhYTQQbmNF0",
  authDomain: "chat-37d0d.firebaseapp.com",
  databaseURL: "https://chat-37d0d.firebaseio.com",
  projectId: "chat-37d0d",
  storageBucket: "chat-37d0d.appspot.com",
  messagingSenderId: "258045159496",
  appId: "1:258045159496:web:df8f2877065573d36c107d",
  measurementId: "G-V4L3B9Q7BN"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
