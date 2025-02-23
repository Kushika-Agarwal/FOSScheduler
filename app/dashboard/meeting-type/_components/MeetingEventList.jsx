// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   deleteDoc,
//   doc,
//   getDoc,
//   getFirestore,
//   orderBy,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { app } from "@/config/FirebaseConfig";
// import { Clock, Copy, MapPin, Settings, Trash } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// function MeetingEventList() {
//   const [eventList, setEventList] = useState([]);
//   const [user, setUser] = useState(null);
//   const [businessInfo, setBusinessInfo] = useState(null);
//   const db = getFirestore(app);
//   const auth = getAuth(app);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         getEventList(currentUser.email);
//         fetchBusinessInfo(currentUser.email);
//       } else {
//         setUser(null);
//         setEventList([]);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const getEventList = async (email) => {
//     setEventList([]);
//     const q = query(
//       collection(db, "MeetingEvent"),
//       where("createdBy", "==", email),
//       orderBy("id", "desc")
//     );
//     const querySnapshot = await getDocs(q);
//     const events = querySnapshot.docs.map((doc) => doc.data());
//     setEventList(events);
//   };

//   const fetchBusinessInfo = async (email) => {
//     const docRef = doc(db, "Business", email);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       setBusinessInfo(docSnap.data());
//     }
//   };

//   const onDeleteMeetingEvent = async (event) => {
//     await deleteDoc(doc(db, "MeetingEvent", event?.id));
//     toast.success("Meeting Deleted");
//     getEventList(user.email);
//   };

//   const onCopyClickHandler = (event) => {
//     const meetingEventUrl =
//       process.env.NEXT_PUBLIC_BASE_URL +
//       "/" +
//       businessInfo?.businessName +
//       "/" +
//       event.id;
//     navigator.clipboard.writeText(meetingEventUrl);
//     toast.success("URL copied");
//   };

//   return (
//     <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//       {eventList.length > 0 ? (
//         eventList.map((event, index) => (
//           <div
//             key={index}
//             className="border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3"
//             style={{ borderTopColor: event?.themeColor }}
//           >
//             <div className="flex justify-end">
//               <DropdownMenu>
//                 <DropdownMenuTrigger>
//                   <Settings className=" cursor-pointer" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem
//                     className="flex gap-2"
//                     onClick={() => onDeleteMeetingEvent(event)}
//                   >
//                     <Trash /> Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//             <h2 className="font-medium text-2xl">{event?.eventName}</h2>
//             <div className="flex justify-between">
//               <h2 className="flex gap-2 text-gray-500">
//                 <Clock /> {event.duration} Min
//               </h2>
//               <h2 className="flex gap-2 text-gray-500">
//                 <MapPin /> {event.location}
//               </h2>
//             </div>
//             <hr />
//             <div className="flex justify-between">
//               <h2
//                 className="flex gap-2 text-sm items-center text-primary cursor-pointer"
//                 onClick={() => {
//                   onCopyClickHandler(event);
//                 }}
//               >
//                 <Copy className="h-4 w-4 " /> Copy Link
//               </h2>
//               <Button
//                 className="rounded-full text-primary border-primary"
//                 variant="outline"
//               >
//                 Share
//               </Button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <h2>No event found</h2>
//       )}
//     </div>
//   );
// }

// export default MeetingEventList;

"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/config/FirebaseConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, Copy, MapPin, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function MeetingEventList() {
  const [eventList, setEventList] = useState([]);
  const [user, setUser] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        console.error("User fetch error:", error);
        return;
      }

      setUser(userData.user);
      getEventList(userData.user.email);
      fetchBusinessInfo(userData.user.email);
    };

    fetchUserData();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          fetchUserData();
        } else {
          setUser(null);
          setEventList([]);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const getEventList = async (email) => {
    console.log("Fetching events for:", email); // Debugging log
    const { data, error } = await supabase
      .from("MeetingEvent")
      .select("*")
      .eq("created_by", email)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    console.log("Events fetched:", data); // Debugging log
    setEventList(data);
  };

  const fetchBusinessInfo = async (email) => {
    const { data, error } = await supabase
      .from("Business")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching business info:", error);
      return;
    }
    setBusinessInfo(data);
  };

  const onDeleteMeetingEvent = async (eventId) => {
    const { error } = await supabase
      .from("MeetingEvent")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return;
    }

    toast.success("Meeting Deleted");
    getEventList(user.email);
  };

  const onCopyClickHandler = (eventId) => {
    const meetingEventUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${businessInfo?.business_name}/${eventId}`;
    navigator.clipboard.writeText(meetingEventUrl);
    toast.success("URL copied");
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {eventList.length > 0 ? (
        eventList.map((event) => (
          <div
            key={event.id}
            className="border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3"
            style={{ borderTopColor: event.theme_color }}
          >
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Settings className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => onDeleteMeetingEvent(event.id)}
                  >
                    <Trash /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h2 className="font-medium text-2xl">{event.event_name}</h2>
            <div className="flex justify-between">
              <h2 className="flex gap-2 text-gray-500">
                <Clock /> {event.duration} Min
              </h2>
              <h2 className="flex gap-2 text-gray-500">
                <MapPin /> {event.location}
              </h2>
            </div>
            <hr />
            <div className="flex justify-between">
              <h2
                className="flex gap-2 text-sm items-center text-primary cursor-pointer"
                onClick={() => onCopyClickHandler(event.id)}
              >
                <Copy className="h-4 w-4 " /> Copy Link
              </h2>
              <Button
                className="rounded-full text-primary border-primary"
                variant="outline"
              >
                Share
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2>No event found</h2>
      )}
    </div>
  );
}

export default MeetingEventList;
