import React from "react";
import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {

};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
