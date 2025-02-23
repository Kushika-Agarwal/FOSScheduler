// "use client";
// import React, { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ScheduledMeetingList from "./_components/ScheduledMeetingList";
// import {
//   collection,
//   getDocs,
//   getFirestore,
//   query,
//   where,
// } from "firebase/firestore";
// import { app } from "@/config/FirebaseConfig";
// import { format } from "date-fns";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// function ScheduledMeeting() {
//   const db = getFirestore(app);
//   const auth = getAuth();

//   const [user, setUser] = useState(null);
//   const [meetingList, setMeetingList] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         getScheduledMeetings(firebaseUser.email); // Fetch meetings when user is logged in
//       } else {
//         setUser(null); // Clear user data when logged out
//       }
//     });

//     // Clean up the listener when the component is unmounted
//     return () => unsubscribe();
//   }, []);

//   const getScheduledMeetings = async (email) => {
//     setMeetingList([]);
//     const q = query(
//       collection(db, "ScheduledMeetings"),
//       where("businessEmail", "==", email)
//     );
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       console.log(doc.data());
//       setMeetingList((prev) => [...prev, doc.data()]);
//     });
//   };

//   const filterMeetingList = (type) => {
//     if (type == "upcoming") {
//       return meetingList.filter(
//         (item) => item.formattedTimeStamp >= format(new Date(), "t")
//       );
//     } else {
//       return meetingList.filter(
//         (item) => item.formattedTimeStamp < format(new Date(), "t")
//       );
//     }
//   };

//   return (
//     <div className="p-10">
//       <h2 className="font-bold text-2xl">Scheduled Meetings</h2>
//       <hr className="my-5" />
//       <Tabs defaultValue="upcoming" className="w-[400px]">
//         <TabsList>
//           <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//           <TabsTrigger value="expired">Expired</TabsTrigger>
//         </TabsList>
//         <TabsContent value="upcoming">
//           <ScheduledMeetingList meetingList={filterMeetingList("upcoming")} />
//         </TabsContent>
//         <TabsContent value="expired"></TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// export default ScheduledMeeting;

"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduledMeetingList from "./_components/ScheduledMeetingList";
import { format } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/config/FirebaseConfig"; // Ensure this file contains Supabase setup

function ScheduledMeeting() {
  const [user, setUser] = useState(null);
  const [meetingList, setMeetingList] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        getScheduledMeetings(session.user.email);
      } else {
        setUser(null);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          getScheduledMeetings(session.user.email);
        } else {
          setUser(null);
        }
      }
    );

    checkAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getScheduledMeetings = async (email) => {
    setMeetingList([]);
    const { data, error } = await supabase
      .from("ScheduledMeetings")
      .select("*")
      .eq("businessEmail", email);

    if (error) {
      console.error("Error fetching meetings:", error);
      return;
    }

    setMeetingList(data || []);
  };

  const filterMeetingList = (type) => {
    const currentTime = new Date().getTime();
    return meetingList.filter((item) =>
      type === "upcoming"
        ? new Date(item.formattedTimeStamp).getTime() >= currentTime
        : new Date(item.formattedTimeStamp).getTime() < currentTime
    );
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Scheduled Meetings</h2>
      <hr className="my-5" />
      <Tabs defaultValue="upcoming" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <ScheduledMeetingList meetingList={filterMeetingList("upcoming")} />
        </TabsContent>
        <TabsContent value="expired">
          <ScheduledMeetingList meetingList={filterMeetingList("expired")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ScheduledMeeting;
