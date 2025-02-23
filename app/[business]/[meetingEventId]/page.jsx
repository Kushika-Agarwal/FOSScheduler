// "use client";
// import React, { useEffect, useState } from "react";
// import MeetingTimeDateSelection from "../_components/MeetingTimeDateSelection";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   getFirestore,
//   query,
//   where,
// } from "firebase/firestore";
// import { app } from "@/config/FirebaseConfig";

// function SharedMeetingEvent({ params }) {
//   const db = getFirestore(app);
//   const [businessInfo, setBusinessInfo] = useState(null);
//   const [eventInfo, setEventInfo] = useState();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     params && getMeetingBusinessAndEventDetails();
//   }, [params]);

//   const getMeetingBusinessAndEventDetails = async () => {
//     setLoading(true);
//     const q = query(
//       collection(db, "Business"),
//       where("businessName", "==", params.business)
//     );
//     const docSnap = await getDocs(q);
//     docSnap.forEach((doc) => {
//       setBusinessInfo(doc.data());
//     });

//     const docRef = doc(db, "MeetingEvent", params?.meetingEventId);
//     const result = await getDoc(docRef);
//     setEventInfo(result.data());

//     setLoading(false);
//   };
//   return (
//     <div>
//       <MeetingTimeDateSelection
//         eventInfo={eventInfo}
//         businessInfo={businessInfo}
//       />
//     </div>
//   );
// }

// export default SharedMeetingEvent;

"use client";
import React, { useEffect, useState } from "react";
import MeetingTimeDateSelection from "../_components/MeetingTimeDateSelection";
import { supabase } from "@/config/FirebaseConfig"; // Ensure Supabase is configured

function SharedMeetingEvent({ params }) {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params) {
      getMeetingBusinessAndEventDetails();
    }
  }, [params]);

  const getMeetingBusinessAndEventDetails = async () => {
    setLoading(true);

    // Fetch Business Info
    const { data: businessData, error: businessError } = await supabase
      .from("Business")
      .select("*")
      .eq("business_name", params.business)
      .single();

    if (businessError) {
      console.error("Error fetching business info:", businessError);
    } else {
      setBusinessInfo(businessData);
    }

    // Fetch Meeting Event Info
    const { data: eventData, error: eventError } = await supabase
      .from("MeetingEvent")
      .select("*")
      .eq("id", params.meetingEventId)
      .single();

    if (eventError) {
      console.error("Error fetching meeting event:", eventError);
    } else {
      setEventInfo(eventData);
    }

    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <MeetingTimeDateSelection
          eventInfo={eventInfo}
          businessInfo={businessInfo}
        />
      )}
    </div>
  );
}

export default SharedMeetingEvent;
