"use client";
import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/FirebaseConfig"; // Ensure correct path
import { signOut } from "firebase/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DashBoardHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);

    router.push("/login");
  };

  return (
    <div className="p-4 mx-10">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center float-right">
            <Image
              src="/man.jpeg"
              alt="profile pic"
              width={50}
              height={40}
              className="rounded-full"
            />
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default DashBoardHeader;
