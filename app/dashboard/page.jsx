"use client";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

function Dashboard() {
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    user && isBusinessRegistered();
  }, [user]);
  const isBusinessRegistered = async () => {
    const docRef = doc(db, "Business", user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setLoading(false);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setLoading(false);
      router.replace("/create-business");
    }
  };
  if (loading) {
    return <div>Loading....</div>;
  }
}

export default Dashboard;
