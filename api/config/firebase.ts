import admin from "firebase-admin";

// Initialize on GCP
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://yacma-295322.firebaseio.com",
});

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export const FieldPath = admin.firestore.FieldPath;
