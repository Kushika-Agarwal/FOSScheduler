"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Header() {
  return (
    <div>
      <div className="flex items-center justify-between p-5 shadow-md">
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          alt="logo"
          className="w-[60px] md:w-[80px] ml-8"
        />
        <ul className="hidden md:flex gap-14 font-medium text-lg">
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            Product
          </li>
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            Pricing
          </li>
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            Contact Us
          </li>
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            About Us
          </li>
        </ul>
        <div>
          <Link href={"/login"}>
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href={"/signup"}>
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
