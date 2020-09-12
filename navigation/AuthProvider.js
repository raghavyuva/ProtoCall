import React, { createContext, useState } from "react";
import firebase from 'firebase';
import Loading from '../components/Loading';
export const AuthContext = createContext({});
import auth from 'firebase/auth';
import firestore from 'firebase/firestore';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            setLoading(false);
          } catch (e) {
            alert(e)
          }
        },
        register: async (email, password,name) => {
          try {
          
            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
             firebase.firestore().collection('users').doc(uid).set({
               username:name,
               email:email,
             })
          } catch (e) {
            alert(e)
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
          } catch (e) {
            alert(e)
          }
        },
      uid:async()=>{
          return (firebase.auth().currentUser || {}).uid
      }
      }}

    >
      {children}
    </AuthContext.Provider>
  );
};
