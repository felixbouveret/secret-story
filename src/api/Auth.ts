import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  NextOrObserver,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';

import firebase from './firebase';

const auth = getAuth(firebase);

const register = async (email: string, password: string) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

const login = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    return credential;
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  }
};

const authState = (fcn: NextOrObserver<User>) => onAuthStateChanged(auth, fcn);

export default {
  register,
  login,
  logout,
  googleLogin,
  authState
};
