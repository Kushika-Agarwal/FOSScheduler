"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { app } from "@/config/FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function CreateBusiness() {
  const [business, setBusiness] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        router.replace("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, [auth, router]);

  const onCreateBusiness = async () => {
    if (!user) {
      toast.error("User not authenticated!");
      return;
    }

    try {
      await setDoc(doc(db, "Business", user.email), {
        businessName: business,
        email: user.email,
        userName: user.displayName || "Unknown User",
      });

      toast.success("New Business Created!");
      router.replace("/dashboard");
    } catch (error) {
      toast.error("Error creating business: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-14 gap-20">
      <Image src="/logo.png" width={100} height={100} alt="Logo" />
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h2 className="text-4xl font-bold">
          What should we call your Business?
        </h2>
        <p className="text-slate-500">
          You can always change this later from settings
        </p>

        <div className="w-full flex flex-col gap-4">
          <label className="text-slate-400">Business Name</label>
          <Input
            placeholder="Business Name"
            className="mt-2"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          disabled={!business || !user}
          onClick={onCreateBusiness}
        >
          Create Business
        </Button>
      </div>
    </div>
  );
}

export default CreateBusiness;
