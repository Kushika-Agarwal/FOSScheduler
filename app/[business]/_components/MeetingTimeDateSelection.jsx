// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { Calendar } from "@/components/ui/calendar";

// import { CalendarCheck, Clock, MapPin, Timer } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import TimeDateSelection from "./TimeDateSelection";
// import { format, formatDate, formatters } from "date-fns";
// import UserFormInfo from "./UserFormInfo";
// import {
//   collection,
//   doc,
//   getDocs,
//   getFirestore,
//   query,
//   setDoc,
//   where,
// } from "firebase/firestore";
// import { app } from "@/config/FirebaseConfig";
// import { toast } from "sonner";

// import { useRouter } from "next/navigation";
// // import { useRouter } from "next/router";

// function MeetingTimeDateSelection({ eventInfo, businessInfo }) {
//   const [date, setDate] = useState(new Date());
//   const [timeSlots, setTimeSlots] = useState();
//   const [enableTimeSlot, setEnableTimeSlot] = useState();
//   const [selectedTime, setSelectedTime] = useState();
//   const [userEmail, setUserEmail] = useState();
//   const [userName, setUserName] = useState();
//   const [userNote, setUserNote] = useState("");
//   const [prevBooking, setPrevBooking] = useState([]);
//   const [step, setStep] = useState(1);
//   const router = useRouter();

//   const db = getFirestore(app);

//   useEffect(() => {
//     eventInfo?.duration && createTimeSlot(eventInfo.duration);
//   }, [eventInfo]);
//   const createTimeSlot = (interval) => {
//     const startTime = 8 * 60; // 8 am in minutes
//     const endTime = 22 * 60; //10pm in minutes
//     const totalSlots = (endTime - startTime) / interval;
//     const slots = Array.from({ length: totalSlots }, (_, i) => {
//       const totalMinutes = startTime + i * interval;
//       const hours = Math.floor(totalMinutes / 60);
//       const minutes = totalMinutes % 60;
//       const formattedHours = hours > 12 ? hours - 12 : hours;
//       const period = hours >= 12 ? "PM" : "AM";
//       return `${String(formattedHours).padStart(2, "0")}:${String(
//         minutes
//       ).padStart(2, "0")} ${period}`;
//     });

//     console.log(slots);
//     setTimeSlots(slots);
//   };
//   const handleDateChange = (date) => {
//     if (!(date instanceof Date) || isNaN(date)) {
//       console.error("Invalid date object:", date);
//       return;
//     }

//     setDate(date);

//     const day = format(date, "EEEE");
//     if (businessInfo?.daysAvailable?.[day]) {
//       getPrevEventBooking(date);
//       setEnableTimeSlot(true);
//     } else {
//       setEnableTimeSlot(false);
//     }
//   };

//   const handleScheduleEvent = async () => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (regex.test(userEmail) == false) {
//       toast("Enter a valid email");
//       return;
//     }
//     const docId = Date.now().toString();
//     await setDoc(doc(db, "ScheduledMeetings", docId), {
//       businessName: businessInfo.businessName,
//       businessEmail: businessInfo.email,
//       selectedTime: selectedTime,
//       selectedDate: date,
//       formatDate: format(date, "PPP"),
//       formattedTimeStamp: format(date, "t"),
//       duration: eventInfo.duration,
//       locationUrl: eventInfo.locationUrl,
//       eventId: eventInfo.id,
//       id: docId,
//       userName: userName,
//       userEmail: userEmail,
//     }).then((res) => {
//       toast("Meeting Scheduled Successfully");
//     });
//   };

//   const getPrevEventBooking = async (date_) => {
//     if (!eventInfo || !eventInfo.id) {
//       console.error("eventInfo is missing or eventId is undefined");
//       return;
//     }

//     const q = query(
//       collection(db, "ScheduledMeetings"),
//       where("selectedDate", "==", date_),
//       where("eventId", "==", eventInfo.id)
//     );

//     const querySnapshot = await getDocs(q);

//     querySnapshot.forEach((doc) => {
//       console.log("--", doc.data());
//       setPrevBooking((prev) => [...prev, doc.data()]);
//     });
//   };

//   return (
//     <div
//       className="p-5 py-10 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56"
//       style={{ borderTopColor: eventInfo?.themeColor }}
//     >
//       <Image src={"/logo.png"} alt="logo" width={150} height={150} />
//       <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
//         <div className="p-4 border-r">
//           {/* Meeting Details  */}
//           <h2>{businessInfo?.businessName}</h2>
//           <h2 className="font-bold text-2xl">
//             {eventInfo?.eventName ? eventInfo?.eventName : "Meeting Name"}
//           </h2>

//           <div className="mt-5 flex flex-col gap-4">
//             <h2 className="flex gap-2">
//               <Clock />
//               {eventInfo?.duration}
//             </h2>
//             <h2 className="flex gap-2">
//               <MapPin />
//               {eventInfo?.location} Meeting
//             </h2>
//             <h2 className="flex gap-2">
//               <CalendarCheck />
//               {date && format(date, "PPP")}
//             </h2>

//             <h2 className="flex gap-2">
//               <Timer />
//               {selectedTime}
//             </h2>

//             <Link
//               href={eventInfo?.locationUrl ? eventInfo?.locationUrl : "#"}
//               className="text-primary"
//             >
//               {eventInfo?.locationUrl}
//             </Link>
//           </div>
//         </div>
//         {step == 1 ? (
//           <TimeDateSelection
//             date={date}
//             enableTimeSlot={enableTimeSlot}
//             handleDateChange={handleDateChange}
//             setSelectedTime={setSelectedTime}
//             timeSlots={timeSlots}
//             selectedTime={selectedTime}
//             prevBooking={prevBooking}
//           />
//         ) : (
//           <UserFormInfo
//             setUserName={setUserName}
//             setUserEmail={setUserEmail}
//             setUserNote={setUserNote}
//           />
//         )}
//       </div>
//       <div className="flex gap-3 justify-end">
//         {step == 2 && (
//           <Button variant="outline" onClick={() => setStep(1)}>
//             Back
//           </Button>
//         )}

//         {step == 1 ? (
//           <Button
//             className="mt-10 float-right"
//             disabled={!selectedTime || !date}
//             onClick={() => setStep(step + 1)}
//           >
//             Next
//           </Button>
//         ) : (
//           <Button
//             disabled={!userEmail || !userName || !userNote}
//             onClick={handleScheduleEvent}
//           >
//             Schedule
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MeetingTimeDateSelection;
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, MapPin, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeDateSelection from "./TimeDateSelection";
import { format } from "date-fns";
import UserFormInfo from "./UserFormInfo";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Supabase Config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function MeetingTimeDateSelection({ eventInfo, businessInfo }) {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState();
  const [enableTimeSlot, setEnableTimeSlot] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userName, setUserName] = useState();
  const [userNote, setUserNote] = useState("");
  const [prevBooking, setPrevBooking] = useState([]);
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    eventInfo?.duration && createTimeSlot(eventInfo.duration);
  }, [eventInfo]);

  const createTimeSlot = (interval) => {
    const startTime = 8 * 60;
    const endTime = 22 * 60;
    const totalSlots = (endTime - startTime) / interval;
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? "PM" : "AM";
      return `${String(formattedHours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${period}`;
    });

    setTimeSlots(slots);
  };

  const handleDateChange = async (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      console.error("Invalid date object:", date);
      return;
    }

    setDate(date);
    const day = format(date, "EEEE");

    if (businessInfo?.daysAvailable?.[day]) {
      await getPrevEventBooking(date);
      setEnableTimeSlot(true);
    } else {
      setEnableTimeSlot(false);
    }
  };

  const handleScheduleEvent = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(userEmail)) {
      toast("Enter a valid email");
      return;
    }

    const { data, error } = await supabase.from("ScheduledMeetings").insert([
      {
        business_name: businessInfo.business_name,
        email: businessInfo.email,
        selectedTime: selectedTime,
        selectedDate: date.toISOString().split("T")[0],
        formatDate: format(date, "PPP"),
        formattedTimeStamp: format(date, "t"),
        duration: eventInfo.duration,
        location_url: eventInfo.location_url,
        eventId: eventInfo.id,
        userName: userName,
        userEmail: userEmail,
      },
    ]);

    if (error) {
      toast(`Error: ${error.message}`);
    } else {
      toast("Meeting Scheduled Successfully");
    }
  };

  const getPrevEventBooking = async (date_) => {
    if (!eventInfo || !eventInfo.id) {
      console.error("eventInfo is missing or eventId is undefined");
      return;
    }

    const { data, error } = await supabase
      .from("ScheduledMeetings")
      .select("*")
      .eq("selectedDate", date_.toISOString().split("T")[0])
      .eq("eventId", eventInfo.id);

    if (error) {
      console.error("Error fetching previous bookings:", error);
    } else {
      setPrevBooking(data);
    }
  };

  return (
    <div
      className="p-5 py-10 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56"
      style={{ borderTopColor: eventInfo?.themeColor }}
    >
      <Image src={"/logo.png"} alt="logo" width={150} height={150} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
        <div className="p-4 border-r">
          <h2>{businessInfo?.business_name}</h2>
          <h2 className="font-bold text-2xl">
            {eventInfo?.event_name || "Meeting Name"}
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <h2 className="flex gap-2">
              <Clock />
              {eventInfo?.duration}
            </h2>
            <h2 className="flex gap-2">
              <MapPin />
              {eventInfo?.location} Meeting
            </h2>
            <h2 className="flex gap-2">
              <CalendarCheck />
              {date && format(date, "PPP")}
            </h2>
            <h2 className="flex gap-2">
              <Timer />
              {selectedTime}
            </h2>

            <Link
              href={eventInfo?.location_url || "#"}
              className="text-primary"
            >
              {eventInfo?.location_url}
            </Link>
          </div>
        </div>
        {step === 1 ? (
          <TimeDateSelection
            {...{
              date,
              enableTimeSlot,
              handleDateChange,
              setSelectedTime,
              timeSlots,
              selectedTime,
              prevBooking,
            }}
          />
        ) : (
          <UserFormInfo {...{ setUserName, setUserEmail, setUserNote }} />
        )}
      </div>
      <Button onClick={step === 1 ? () => setStep(2) : handleScheduleEvent}>
        {step === 1 ? "Next" : "Schedule"}
      </Button>
    </div>
  );
}

export default MeetingTimeDateSelection;
