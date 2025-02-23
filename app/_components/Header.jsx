"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Header() {
  return (
    <div>
      <div className="flex items-center justify-between  shadow-md">
        <Image
          src="/logo.png"
          width={200}
          height={200}
          alt="logo"
          className="w-[100px] md:w-[150px] ml-8"
        />
        <ul className="hidden md:flex gap-14 font-medium text-lg">
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            <Link href="https://github.com/Kushika-Agarwal/FOSScheduler/blob/main/README.md">
              About Project
            </Link>
          </li>
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            <Link href="https://github.com/Kushika-Agarwal/FOSScheduler">
              Github Repo
            </Link>
          </li>
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            <Link href="https://fossunited.org/hack/fosshack25/p/l14hc6qms7">
              FOSS project
            </Link>
          </li>
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            <Link href="https://github.com/Kushika-Agarwal/FOSScheduler/blob/main/LICENSE">
              License
            </Link>
          </li>
          <li className="hover:text-primary hover:bg-slate-50 transition-all duration-300 cursor-pointer">
            <Link href="https://docs.google.com/presentation/d/1tIwEVdvXVCc-93Bsz1hpOpDtpNk9r-ZhRqLMX_gU3bo/edit">
              Presentation
            </Link>
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
