import { createContext, useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/config'; // Ensure this import path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password); // Or your custom signInUser method
  };
  

  const signOut = async () => {
    try {
      await auth.signOut(); // Directly call signOut on the auth object
      setCurrentUser(null);
    } catch (error) {
      console.error("Failed to sign out: ", error);
    }
  };


  return (
    <AuthContext.Provider value={{currentUser, signIn, signOut}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
