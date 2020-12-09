import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const functions = firebase.functions();

if (window.location.hostname === "localhost") {
  functions.useEmulator("localhost", 5000);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export { functions };
export const FieldValue = firebase.firestore.FieldValue;
export type IUser = firebase.User;
export type AuthError = firebase.auth.Error;
export type UserCredential = firebase.auth.UserCredential;
