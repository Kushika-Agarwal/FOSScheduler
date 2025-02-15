"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function CreateBusiness() {
  const [business, setBusiness] = useState();
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const db = getFirestore(app);
  const onCreateBusiness = async () => {
    await setDoc(doc(db, "Business", user.email), {
      businessName: business,
      email: user.email,
      userName: user.given_name + " " + user.family_name,
    }).then((resp) => {
      toast.success("New Business Created!");
      router.replace("/dashboard");
    });
  };
  return (
    <div className="flex flex-col items-center p-14 gap-20">
      <Image src="/logo.svg" width={100} height={100} />
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h2 className="text-4xl font-bold">
          What should we call your Business?
        </h2>
        <p className="text-slate-500">
          You can always change this later from settings
        </p>

        <div className="w-full flex flex-col gap-4">
          <label className="text-slate-400">Team Name</label>
          <Input
            placeholder="Team Name"
            className="mt-2"
            onChange={(e) => setBusiness(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          disabled={!business}
          onClick={onCreateBusiness}
        >
          Create Business
        </Button>
      </div>
    </div>
  );
}

export default CreateBusiness;
