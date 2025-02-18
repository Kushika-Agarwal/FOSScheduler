"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";

function Dashboard() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await isBusinessRegistered(currentUser);
      } else {
        // Delay redirect to avoid unnecessary flickers
        setTimeout(() => {
          router.replace("/login");
        }, 500);
      }
    });

    return () => unsubscribe();
  }, []);

  const isBusinessRegistered = async (currentUser) => {
    if (!currentUser) return;

    const docRef = doc(db, "Business", currentUser.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setBusiness(docSnap.data());
    } else {
      console.log("No such document!");
      router.replace("/create-business");
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <div>Welcome to your Dashboard, {user?.email}</div>
      <div>Your Buisness {business?.businessName}</div>
    </>
  );
}

export default Dashboard;
