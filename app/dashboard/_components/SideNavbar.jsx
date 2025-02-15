"use client";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Clock, Plus, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
function SideNavbar() {
  const menu = [
    {
      id: 1,
      name: "Meeting Type",
      path: "/dashboard/meeting-type",
      icon: Briefcase,
    },
    {
      id: 2,
      name: "Scheduled Meeting",
      path: "/dashboard/scheduled-meeting",
      icon: Calendar,
    },
    {
      id: 3,
      name: "Availability",
      path: "/dashboard/availability",
      icon: Clock,
    },
    {
      id: 4,
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];
  const path = usePathname();
  const [activePath, setActivePath] = useState(path);
  useEffect(() => {
    setActivePath(path);
  }, [path]);
  return (
    <div className="p-5 py-14">
      <div className="flex justify-center">
        <Image src="/logo.svg" width={80} height={80} alt="logo" />
      </div>
      <div>
        <Link href="/create-meeting">
          <Button className="flex gap-2 w-full rounded-full mt-7">
            <Plus />
            Create
          </Button>
        </Link>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {menu.map((item, index) => (
          <Link href={item.path} key={index}>
            <Button
              variant="ghost"
              className={`w-full flex gap-2 justify-start hover:bg-primary hover:text-white ${
                activePath == item.path && "bg-primary text-white"
              }`}
            >
              <item.icon />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNavbar;
