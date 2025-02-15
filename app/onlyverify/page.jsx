import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("No user is logged in.");
  }
});
