import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { db, auth, google } from "../firebase.ts";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const testDocRef = doc(db, "test", "single-document");

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("lastKnownCount");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [docRef, setDocRef] = useState(null);
  const [user, setUser] = useState(null);
  const [wasDeleted, setWasDeleted] = useState(() => {
    return localStorage.getItem("wasDeleted") === "true";
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (wasDeleted) return;

    const loadDocument = async () => {
      try {
        const docSnap = await getDoc(testDocRef);
        if (docSnap.exists()) {
          const value = docSnap.data().count || 0;
          setCount(value);
          localStorage.setItem("lastKnownCount", value.toString());
          setDocRef(testDocRef);
        } else {
          await setDoc(testDocRef, { count: 0 });
          setCount(0);
          localStorage.setItem("lastKnownCount", "0");
          setDocRef(testDocRef);
        }
      } catch (error) {
        console.error("Error loading document:", error);
      }
    };

    loadDocument();
  }, []);

  useEffect(() => {
    if (!docRef || wasDeleted) return;

    const update = async () => {
      try {
        await updateDoc(docRef, { count });
        localStorage.setItem("lastKnownCount", count.toString());
      } catch (e) {
        console.error("Error updating Firestore:", e);
      }
    };

    update();
  }, [count]);

  const handleAuthClick = () => {
    if (user) {
      signOut(auth).catch(console.error);
      setUser(null);
    } else {
      signInWithPopup(auth, google)
        .then((res) => setUser(res.user))
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!docRef) return;
    try {
      await deleteDoc(docRef);
      localStorage.setItem("wasDeleted", "true");
      localStorage.setItem("lastKnownCount", count.toString());
      setWasDeleted(true);
      setDocRef(null);
    } catch (e) {
      console.error("Failed to delete document:", e);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("wasDeleted");
    localStorage.removeItem("lastKnownCount");
    window.location.reload();
  };

  return (
    <>
    <div className="title">
      <h2>Welcome to my final project</h2>
      <h1>Counter</h1>
    </div>
      {user && <p>Signed in as: {user.displayName}</p>}
      <div className="card">
        {user && (
          <button onClick={() => setCount((c) => c + 1)} disabled={wasDeleted}>
            count is {count}
          </button>
        )}
        <button onClick={handleAuthClick}>
          {user ? "sign out" : "sign in"}
        </button>
        {user && (
          <button onClick={handleDelete} disabled={wasDeleted}>
            reset?
          </button>
        )}
        {wasDeleted && <button onClick={handleReset}>confirm</button>}
      </div>
    </>
  );
}

export default App;
