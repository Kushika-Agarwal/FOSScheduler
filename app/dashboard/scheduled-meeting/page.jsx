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
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function ScheduledMeeting() {
  const [user, setUser] = useState(null);
  const [meetingList, setMeetingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial auth check and setup auth listener
    const setupAuth = async () => {
      try {
        // Check current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          setUser(session.user);
          await getScheduledMeetings(session.user.email);
        }

        // Setup auth listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            setUser(session.user);
            await getScheduledMeetings(session.user.email);
          } else {
            setUser(null);
            setMeetingList([]);
          }
        });

        // Cleanup subscription
        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error("Auth error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const getScheduledMeetings = async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("ScheduledMeetings")
        .select("*")
        .eq("email", email);

      if (error) throw error;

      console.log("Fetched meetings:", data);
      setMeetingList(data || []);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to fetch meetings");
      setMeetingList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMeetingList = (type) => {
    try {
      const currentTimestamp = format(new Date(), "t");
      return meetingList.filter((item) => {
        if (type === "upcoming") {
          return item.formattedTimeStamp >= currentTimestamp;
        } else {
          return item.formattedTimeStamp < currentTimestamp;
        }
      });
    } catch (err) {
      console.error("Error filtering meetings:", err);
      return [];
    }
  };

  if (error) {
    return (
      <div className="p-10">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Scheduled Meetings</h2>
      <hr className="my-5" />
      <Tabs defaultValue="upcoming" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        {isLoading ? (
          <div className="mt-4">Loading meetings...</div>
        ) : (
          <>
            <TabsContent value="upcoming">
              <ScheduledMeetingList
                meetingList={filterMeetingList("upcoming")}
              />
            </TabsContent>
            <TabsContent value="expired">
              <ScheduledMeetingList
                meetingList={filterMeetingList("expired")}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default ScheduledMeeting;
