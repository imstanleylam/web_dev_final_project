// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJMrDUVVtNusrG3oPFS6OdxCURKkG7fX0",
  authDomain: "my-awesome-final-project-a6db8.firebaseapp.com",
  projectId: "my-awesome-final-project-a6db8",
  storageBucket: "my-awesome-final-project-a6db8.firebasestorage.app",
  messagingSenderId: "676486325934",
  appId: "1:676486325934:web:31ce31abaffa752c88ef3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const google = new GoogleAuthProvider();
