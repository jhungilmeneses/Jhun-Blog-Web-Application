// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdq4v93S3qLNpkNvBx0EtLES3uSQdM8mo",
    authDomain: "blog-jhun.firebaseapp.com",
    databaseURL: "https://blog-jhun-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "blog-jhun",
    storageBucket: "blog-jhun.firebasestorage.app",
    messagingSenderId: "44352168685",
    appId: "1:44352168685:web:0e585bf63a745cb8ea62e4",
    measurementId: "G-EBVBH23EP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const database = getDatabase(app);
export default app;
