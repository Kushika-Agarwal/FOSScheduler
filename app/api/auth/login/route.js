import { auth } from "@/config/FirebaseConfig.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return new Response(
      JSON.stringify({
        message: "User logged in successfully",
        user: userCredential.user,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
