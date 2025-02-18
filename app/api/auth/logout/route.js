"use client";

import { auth } from "@/config/FirebaseConfig.js";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase Auth works in the client
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
