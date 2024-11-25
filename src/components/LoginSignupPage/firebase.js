import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFbAw_alKpA5NfpQ4jh0ONLsSgZ_CsyZI",
  authDomain: "travel-planner-75b71.firebaseapp.com",
  databaseURL: "https://travel-planner-75b71-default-rtdb.firebaseio.com",
  projectId: "travel-planner-75b71",
  storageBucket: "travel-planner-75b71.firebasestorage.app",
  messagingSenderId: "448809953801",
  appId: "1:448809953801:web:a72ea889c96a84384e66d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
