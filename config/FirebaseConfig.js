// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: "revisescheduler.firebaseapp.com",
//   projectId: "revisescheduler",
//   storageBucket: "revisescheduler.appspot.com",
//   messagingSenderId: "589024998209",
//   appId: "1:589024998209:web:6a5d8cbf2afadd7fd427c0",
//   measurementId: "G-ZN2T387EX6",
// };

// // Prevent multiple initializations
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { app, auth, db };

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
