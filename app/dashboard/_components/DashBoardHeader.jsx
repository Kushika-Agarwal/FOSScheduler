"use client";
import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

function DashBoardHeader() {
  return (
    <div className="p-4 mx-10">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex item-center float-right">
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
            <DropdownMenuItem>
              <LogoutLink>Logout</LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default DashBoardHeader;
