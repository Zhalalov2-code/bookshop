import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAlliOiYMrkU9926mJc1cxSziwBbzrWM1s",
  authDomain: "bookshop-a668a.firebaseapp.com",
  projectId: "bookshop-a668a",
  storageBucket: "bookshop-a668a.appspot.com",
  messagingSenderId: "37005359202",
  appId: "1:37005359202:web:be5a50414c5b8aa30d793b",
  measurementId: "G-EEV5B5EL41"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт авторизации и провайдера Google
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
