import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useReducer } from 'react';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Default context value
const defaultContextValue = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  userData: null,
  login: () => Promise.reject('Firebase context not initialized'),
  register: () => Promise.reject('Firebase context not initialized'),
  logout: () => Promise.reject('Firebase context not initialized'),
  googleSignIn: () => Promise.reject('Firebase context not initialized'),
  updateUserData: () => Promise.reject('Firebase context not initialized'),
};

// Create context with default value
export const FirebaseContext = createContext(defaultContextValue);

// Initial state
const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  userData: null,
};

// Reducer
const firebaseReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED':
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: !!action.payload,
        user: action.payload || null,
      };
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const FirebaseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        dispatch({ type: 'SET_USER_DATA', payload: userDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch({ type: 'AUTH_STATE_CHANGED', payload: user });
      if (user) {
        await fetchUserData(user.uid);
      } else {
        dispatch({ type: 'SET_USER_DATA', payload: null });
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(userCredential.user.uid);
    return userCredential;
  };

  const register = async (email, password, additionalData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      firstName: additionalData.firstName,
      lastName: additionalData.lastName,
      email: email,
      phone: additionalData.phone,
      gender: additionalData.gender,
      birthday: additionalData.birthday,
      occupation: additionalData.occupation,
      jobsSeeking: additionalData.jobsSeeking,
      skills: additionalData.skills,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    await fetchUserData(userCredential.user.uid);
    return userCredential;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      const names = userCredential.user.displayName?.split(' ') || ['', ''];
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: names[0],
        lastName: names.slice(1).join(' '),
        email: userCredential.user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        profilePicture: userCredential.user.photoURL,
      });
    } else {
      // Update last login
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp(),
      }, { merge: true });
    }

    await fetchUserData(userCredential.user.uid);
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    dispatch({ type: 'SET_USER_DATA', payload: null });
  };

  const updateUserData = async (data) => {
    if (!state.user?.uid) return;
    
    await setDoc(doc(db, 'users', state.user.uid), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    await fetchUserData(state.user.uid);
  };

  return (
    <FirebaseContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        googleSignIn,
        updateUserData,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.node,
};

// Create a custom hook for using Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === defaultContextValue) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Export both named and default for flexibility
export { FirebaseProvider as default };

