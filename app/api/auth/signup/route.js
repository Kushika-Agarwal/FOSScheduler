import { auth, db } from "@/config/FirebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  const { email, password, name } = await req.json();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
    });

    return new Response(
      JSON.stringify({ message: "User registered successfully", user }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
