import { createContext } from 'react';
import { db } from '../firebase/config';

export const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  return <FirebaseContext.Provider value={{ db }}>{children}</FirebaseContext.Provider>;
};
