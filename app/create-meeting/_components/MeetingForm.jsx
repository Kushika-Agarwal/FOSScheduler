// "use client";
// import { ChevronLeft } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import LocationOption from "@/app/_utils/LocationOption";
// import Image from "next/image";
// import Link from "next/link";
// import ThemeOption from "@/app/_utils/ThemeOption";
// import { doc, getFirestore, setDoc } from "firebase/firestore";
// import { app } from "@/config/FirebaseConfig";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// function MeetingForm({ setFormValue }) {
//   const [location, setLocation] = useState();
//   const [themeColor, setThemeColor] = useState();
//   const [eventName, setEventName] = useState();
//   const [duration, setDuration] = useState(30);
//   const [locationUrl, setLocationUrl] = useState();
//   const [user, setUser] = useState(null);

//   const db = getFirestore(app);
//   const auth = getAuth(app);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     setFormValue({
//       eventName: eventName,
//       duration: duration,
//       location: location,
//       locationUrl: locationUrl,
//       themeColor: themeColor,
//     });
//   }, [eventName, location, duration, locationUrl, themeColor]);

//   const onCreateClick = async () => {
//     if (!user) {
//       toast.error("User not authenticated");
//       return;
//     }
//     const id = Date.now().toString();
//     await setDoc(doc(db, "MeetingEvent", id), {
//       id: id,
//       eventName: eventName,
//       duration: duration,
//       location: location,
//       locationUrl: locationUrl,
//       themeColor: themeColor,
//       businessId: doc(db, "Business", user.email),
//       createdBy: user.email,
//     }).then(() => {
//       toast.success("New Meeting event created");
//       router.replace("/dashboard/meeting-type");
//     });
//   };

//   return (
//     <div className="p-8 ">
//       <Link href="/dashboard">
//         <h2 className="flex gap-2">
//           <ChevronLeft /> Cancel
//         </h2>
//       </Link>
//       <div className="mt-4">
//         <h2 className="font-bold text-2xl my-4">Create New Event</h2>
//         <hr />
//       </div>
//       <div className="flex flex-col gap-3 my-4">
//         <h2 className="font-bold">Event Name *</h2>
//         <Input
//           placeholder="Name of your Meeting"
//           onChange={(e) => setEventName(e.target.value)}
//         ></Input>
//         <h2>Duration *</h2>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="max-w-40">
//               {duration}Min
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             {[15, 30, 45, 60].map((time) => (
//               <DropdownMenuItem key={time} onClick={() => setDuration(time)}>
//                 {time} Min
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <h2 className="font-bold">Location</h2>
//         <div className="grid grid-cols-4 gap-3">
//           {LocationOption.map((option, index) => (
//             <div
//               key={index}
//               className={`border flex flex-col justify-center items-center p-3 rounded-lg hover:bg-blue-100 hover:border-primary cursor-pointer${
//                 location === option.name && " bg-blue-100 border-primary"
//               }`}
//               onClick={() => setLocation(option.name)}
//             >
//               <Image
//                 src={option.icon}
//                 width={30}
//                 height={30}
//                 alt={option.name}
//               />
//               <h2>{option.name}</h2>
//             </div>
//           ))}
//         </div>

//         {location && (
//           <>
//             <h2 className="font-bold">Add {location} Url</h2>
//             <Input
//               placeholder="add url"
//               onChange={(e) => setLocationUrl(e.target.value)}
//             />
//           </>
//         )}

//         <h2 className="font-bold">Select Theme Color</h2>
//         <div className="flex justify-evenly">
//           {ThemeOption.map((color, index) => (
//             <div
//               key={index}
//               className={`h-5 w-5 rounded-full ${
//                 themeColor === color && " border-black border-4"
//               }`}
//               style={{ backgroundColor: color }}
//               onClick={() => setThemeColor(color)}
//             ></div>
//           ))}
//         </div>
//       </div>
//       <Button
//         className="w-full mt-9"
//         disabled={!(eventName && duration && location && locationUrl)}
//         onClick={() => onCreateClick()}
//       >
//         Create
//       </Button>
//     </div>
//   );
// }

// export default MeetingForm;

"use client";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocationOption from "@/app/_utils/LocationOption";
import Image from "next/image";
import Link from "next/link";
import ThemeOption from "@/app/_utils/ThemeOption";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function MeetingForm({ setFormValue }) {
  const [location, setLocation] = useState();
  const [themeColor, setThemeColor] = useState();
  const [eventName, setEventName] = useState();
  const [duration, setDuration] = useState(30);
  const [locationUrl, setLocationUrl] = useState();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (userData) setUser(userData.user);
      if (error) console.error(error);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setFormValue({
      eventName,
      duration,
      location,
      locationUrl,
      themeColor,
    });
  }, [eventName, location, duration, locationUrl, themeColor]);

  const onCreateClick = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    const { data: business, error: businessError } = await supabase
      .from("Business")
      .select("id")
      .eq("email", user.email)
      .single();

    if (businessError || !business) {
      toast.error("Business not found");
      return;
    }

    const { error } = await supabase.from("MeetingEvent").insert([
      {
        id: crypto.randomUUID(),
        event_name: eventName,
        duration: duration,
        location: location,
        theme_color: themeColor,
        created_by: user.email,
        created_at: new Date(),
        location_url: locationUrl,
      },
    ]);

    if (error) {
      toast.error("Failed to create event");
    } else {
      toast.success("New Meeting event created");
      router.replace("/dashboard/meeting-type");
    }
  };

  return (
    <div className="p-8 ">
      <Link href="/dashboard">
        <h2 className="flex gap-2">
          <ChevronLeft /> Cancel
        </h2>
      </Link>
      <div className="mt-4">
        <h2 className="font-bold text-2xl my-4">Create New Event</h2>
        <hr />
      </div>
      <div className="flex flex-col gap-3 my-4">
        <h2 className="font-bold">Event Name *</h2>
        <Input
          placeholder="Name of your Meeting"
          onChange={(e) => setEventName(e.target.value)}
        ></Input>
        <h2>Duration *</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="max-w-40">
              {duration} Min
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[15, 30, 45, 60].map((time) => (
              <DropdownMenuItem key={time} onClick={() => setDuration(time)}>
                {time} Min
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <h2 className="font-bold">Location</h2>
        <div className="grid grid-cols-4 gap-3">
          {LocationOption.map((option, index) => (
            <div
              key={index}
              className={`border flex flex-col justify-center items-center p-3 rounded-lg hover:bg-blue-100 hover:border-primary cursor-pointer${
                location === option.name && " bg-blue-100 border-primary"
              }`}
              onClick={() => setLocation(option.name)}
            >
              <Image
                src={option.icon}
                width={30}
                height={30}
                alt={option.name}
              />
              <h2>{option.name}</h2>
            </div>
          ))}
        </div>

        {location && (
          <>
            <h2 className="font-bold">Add {location} Url</h2>
            <Input
              placeholder="add url"
              onChange={(e) => setLocationUrl(e.target.value)}
            />
          </>
        )}

        <h2 className="font-bold">Select Theme Color</h2>
        <div className="flex justify-evenly">
          {ThemeOption.map((color, index) => (
            <div
              key={index}
              className={`h-5 w-5 rounded-full ${
                themeColor === color && " border-black border-4"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setThemeColor(color)}
            ></div>
          ))}
        </div>
      </div>
      <Button
        className="w-full mt-9"
        disabled={!(eventName && duration && location && locationUrl)}
        onClick={() => onCreateClick()}
      >
        Create
      </Button>
    </div>
  );
}

export default MeetingForm;
