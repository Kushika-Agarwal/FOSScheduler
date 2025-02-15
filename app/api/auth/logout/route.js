import { auth } from "@/config/FirebaseConfig.js";
import { signOut } from "firebase/auth";

export async function POST() {
  try {
    await signOut(auth);
    return new Response(
      JSON.stringify({ message: "User logged out successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
