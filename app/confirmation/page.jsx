import { CheckCircle } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function page() {
  return (
    <div className="flex flex-col items-center justify-center p-20">
      <CheckCircle className="h-9 w-9 text-green-500" />
      <h2 className="font-bold text-3xl">Your Meeting is Scheduled</h2>
      <h2 className="text-lg text-gray-500">Confirmation Send</h2>
      <Link href={"/"}>
        <Button>Thank you</Button>
      </Link>
    </div>
  );
}

export default page;
