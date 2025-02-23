import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import Link from "next/link";
function Hero() {
  return (
    <div className="flex flex-col justify-center mt-10 items-center">
      <div className="hidden lg:block">
        <Image
          src="/man.jpeg"
          width={100}
          height={100}
          className="h-[100px] object-cover rounded-full absolute right-36"
        />
        <Image
          src="/man.jpeg"
          width={100}
          height={100}
          className="h-[100px] object-cover rounded-full absolute top-48 left-16"
        />
        <Image
          src="/man.jpeg"
          width={100}
          height={100}
          className="h-[100px] object-cover rounded-full absolute bottom-20 left-36"
        />
        <Image
          src="/man.jpeg"
          width={100}
          height={100}
          className="h-[100px] object-cover rounded-full absolute right-16 bottom-32"
        />
      </div>
      <div className="text-center max-w-2xl">
        <h2 className="font-bold text-[50px] text-slate-700">
          Easy Scheduling ahead
        </h2>
        <h2 className="text-lg mt-5 text-slate-700 font-semibold">
          FOSScheduler is an open-source appointment scheduling platform
          designed for local businesses. It offers a simple, user-friendly
          interface, allowing businesses to manage bookings effortlessly without
          the high costs of SaaS solutions. With real-time availability tracking
          and customizable scheduling, it ensures smooth and efficient
          appointment management for both business owners and clients.
        </h2>
        <div className=" gap-5 mt-5 flex flex-col">
          <h3>Sign up using Email and Password</h3>
          <div className="flex justify-center gap-8 ">
            <Link href={"/signup"}>
              <Button className="p-3 flex justify-center gap-4">
                Sign Up with Email
              </Button>
            </Link>
            <Link href="/login">
              <Button className="p-3 flex justify-center gap-4">
                Sign in with Email
              </Button>
            </Link>
          </div>
          <hr />
          <h2>
            <Link href="#" className="text-primary">
              Sign Up for Free with Email
            </Link>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Hero;
