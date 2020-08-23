import React from "react";
import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCR-1dUEZL8fHP2o_WerECj1HEJBw1Lb2Y",
  authDomain: "chatapp-b76a3.firebaseapp.com",
  databaseURL: "https://chatapp-b76a3.firebaseio.com",
  projectId: "chatapp-b76a3",
  storageBucket: "chatapp-b76a3.appspot.com",
  messagingSenderId: "460369237880",
  appId: "1:460369237880:web:c7d1fbeac395dc05fc1a8d",
  measurementId: "G-KX3Y4QSYMM",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
