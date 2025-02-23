// "use client";
// import DaysList from "@/app/_utils/DaysList";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { app, auth } from "@/config/FirebaseConfig"; // Import Firebase auth
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";

// function Availability() {
//   const [userEmail, setUserEmail] = useState(null);
//   const [daysAvailable, setDaysAvailable] = useState({
//     Sunday: false,
//     Monday: false,
//     Tuesday: false,
//     Wednesday: false,
//     Thursday: false,
//     Friday: false,
//     Saturday: false,
//   });

//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const db = getFirestore(app);

//   useEffect(() => {
//     // Listen for authentication state changes
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserEmail(user.email);
//         getBusinessInfo(user.email);
//       } else {
//         setUserEmail(null);
//       }
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, []);

//   const getBusinessInfo = async (email) => {
//     try {
//       const docRef = doc(db, "Business", email);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const result = docSnap.data();
//         setDaysAvailable(result.daysAvailable || daysAvailable);
//         setStartTime(result.startTime || "");
//         setEndTime(result.endTime || "");
//       }
//     } catch (error) {
//       console.error("Error fetching business info: ", error);
//     }
//   };

//   const onHandleChange = (day, value) => {
//     setDaysAvailable((prevState) => ({
//       ...prevState,
//       [day]: value,
//     }));
//   };

//   const handleSave = async () => {
//     if (!userEmail) {
//       toast.error("User not authenticated");
//       return;
//     }

//     try {
//       console.log(daysAvailable, startTime, endTime);
//       const docRef = doc(db, "Business", userEmail);
//       await updateDoc(docRef, {
//         daysAvailable: daysAvailable,
//         startTime: startTime,
//         endTime: endTime,
//       });
//       toast.success("Availability Saved!");
//     } catch (error) {
//       console.error("Error saving availability: ", error);
//       toast.error("Failed to save availability");
//     }
//   };

//   return (
//     <div className="p-10">
//       <h2 className="font-bold text-2xl">Availability</h2>
//       <hr className="my-7" />
//       <div>
//         <h2 className="font-bold">Availability Days</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 my-3">
//           {DaysList.map((item, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <Checkbox
//                 checked={daysAvailable[item.day] || false}
//                 onCheckedChange={(e) => onHandleChange(item.day, e)}
//               />
//               <h2>{item.day}</h2>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div>
//         <h2 className="font-bold mt-10">Availability Time</h2>
//       </div>
//       <div className="flex gap-10">
//         <div>
//           <h2 className="mt-3">Start Time</h2>
//           <Input
//             type="time"
//             value={startTime}
//             onChange={(e) => setStartTime(e.target.value)}
//           />
//         </div>
//         <div>
//           <h2 className="mt-3">End Time</h2>
//           <Input
//             type="time"
//             value={endTime}
//             onChange={(e) => setEndTime(e.target.value)}
//           />
//         </div>
//       </div>
//       <Button className="mt-10" onClick={handleSave}>
//         Save
//       </Button>
//     </div>
//   );
// }

// export default Availability;
"use client";
import DaysList from "@/app/_utils/DaysList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Availability() {
  const [userEmail, setUserEmail] = useState(null);
  const [daysAvailable, setDaysAvailable] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email);
        getBusinessInfo(data.user.email);
      } else {
        setUserEmail(null);
      }
    };
    getUser();
  }, []);

  const getBusinessInfo = async (email) => {
    try {
      const { data, error } = await supabase
        .from("Business")
        .select("daysAvailable, startTime, endTime")
        .eq("email", email)
        .single();
      if (data) {
        console.log(data);
        setDaysAvailable(data.daysAvailable || daysAvailable);
        setStartTime(data.startTime || "");
        setEndTime(data.endTime || "");
      }
    } catch (error) {
      console.error("Error fetching business info: ", error);
    }
  };

  const onHandleChange = (day, value) => {
    setDaysAvailable((prevState) => ({
      ...prevState,
      [day]: value,
    }));
  };

  const handleSave = async () => {
    if (!userEmail) {
      toast.error("User not authenticated");
      return;
    }
    try {
      const { error } = await supabase
        .from("Business")
        .update({
          daysAvailable: daysAvailable,
          startTime: startTime,
          endTime: endTime,
        })
        .eq("email", userEmail);
      if (error) throw error;
      toast.success("Availability Saved!");
    } catch (error) {
      console.error("Error saving availability: ", error);
      toast.error("Failed to save availability");
    }
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Availability</h2>
      <hr className="my-7" />
      <div>
        <h2 className="font-bold">Availability Days</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 my-3">
          {DaysList.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={daysAvailable[item.day] || false}
                onCheckedChange={(e) => onHandleChange(item.day, e)}
              />
              <h2>{item.day}</h2>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-bold mt-10">Availability Time</h2>
      </div>
      <div className="flex gap-10">
        <div>
          <h2 className="mt-3">Start Time</h2>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <h2 className="mt-3">End Time</h2>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      <Button className="mt-10" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default Availability;
