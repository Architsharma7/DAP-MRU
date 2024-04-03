import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDo_WVKzjdPnBa_AZ4-cmOs7McOQ98CGug",
  authDomain: "dating-mru.firebaseapp.com",
  projectId: "dating-mru",
  storageBucket: "dating-mru.appspot.com",
  messagingSenderId: "771219169826",
  appId: "1:771219169826:web:41e7fff261bd474a3aa07b",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);