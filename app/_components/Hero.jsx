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
        <h2 className="text-lg mt-5 text-slate-500">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio
          mollitia dicta blanditiis culpa aliquid officia, sed deleniti ratione
          odit soluta voluptate neque voluptates, perspiciatis provident
          voluptatibus harum ducimus. Dolor, praesentium!
        </h2>
        <div className=" gap-5 mt-5 flex flex-col">
          <h3>Sign up free with Google and Facebook</h3>
          <div className="flex justify-center gap-8 ">
            <Button className="p-3 flex justify-center gap-4">
              <Image src="/search.png" alt="google" width={30} height={30} />
              Sign Up with Google
            </Button>
            <Button className="p-3 flex justify-center gap-4">
              <Image
                src="/facebook.png"
                alt="facebook"
                width={30}
                height={30}
              />
              Sign Up with Facebook
            </Button>
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
