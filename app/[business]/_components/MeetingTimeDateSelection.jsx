import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";

import { CalendarCheck, Clock, MapPin, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeDateSelection from "./TimeDateSelection";
import { format, formatDate, formatters } from "date-fns";
import UserFormInfo from "./UserFormInfo";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

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

  const db = getFirestore(app);

  useEffect(() => {
    eventInfo?.duration && createTimeSlot(eventInfo.duration);
  }, [eventInfo]);
  const createTimeSlot = (interval) => {
    const startTime = 8 * 60; // 8 am in minutes
    const endTime = 22 * 60; //10pm in minutes
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

    console.log(slots);
    setTimeSlots(slots);
  };

  const handleDateChange = (date) => {
    setDate(date);
    const day = format(date, "EEEE");
    if (businessInfo?.daysAvailable?.[day]) {
      getPrevEventBooking(date);
      setEnableTimeSlot(true);
    } else {
      setEnableTimeSlot(false);
    }
  };

  const handleScheduleEvent = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(userEmail) == false) {
      toast("Enter a valid email");
      return;
    }
    const docId = Date.now().toString();
    await setDoc(doc(db, "ScheduledMeetings", docId), {
      businessName: businessInfo.businessName,
      businessEmail: businessInfo.email,
      selectedTime: selectedTime,
      selectedDate: date,
      formatDate: format(date, "PPP"),
      formattedTimeStamp: format(date, "t"),
      duration: eventInfo.duration,
      locationUrl: eventInfo.locationUrl,
      eventId: eventInfo.id,
      id: docId,
      userName: userName,
      userEmail: userEmail,
    }).then((res) => {
      toast("Meeting Scheduled Successfully");
    });
  };
  // const sendEmail = async (user) => {
  //   const emailHtml = await render(
  //     <Email
  //       businessName={businessInfo?.businessName}
  //       date={format(date, "PPP").toString()}
  //       duration={eventInfo?.duration}
  //       meetingTime={selectedTime}
  //       meetingUrl={eventInfo?.locationUrl}
  //       userFirstName={user}
  //     />
  //   );

  //   plunk.emails
  //     .send({
  //       to: userEmail,
  //       subject: "Meeting Scheduled",
  //       body: emailHtml,
  //     })
  //     .then((resp) => {
  //       console.log(resp);
  //       router.replace("/confirmation");
  //     });
  // };

  // Used to fetch previous booking
  // @params {*} date_

  const getPrevEventBooking = async (date_) => {
    const q = query(
      collection(db, "ScheduledMeetings"),
      where("selectedDate", "==", date_),
      where("eventId", "==", eventInfo.id)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log("--", doc.data());
      setPrevBooking((prev) => [...prev, doc.data()]);
    });
  };
  return (
    <div
      className="p-5 py-10 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56"
      style={{ borderTopColor: eventInfo?.themeColor }}
    >
      <Image src={"/logo.svg"} alt="logo" width={100} height={100} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
        <div className="p-4 border-r">
          {/* Meeting Details  */}
          <h2>{businessInfo?.businessName}</h2>
          <h2 className="font-bold text-2xl">
            {eventInfo?.eventName ? eventInfo?.eventName : "Meeting Name"}
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
              {format(date, "PPP")}
            </h2>
            <h2 className="flex gap-2">
              <Timer />
              {selectedTime}
            </h2>

            <Link
              href={eventInfo?.locationUrl ? eventInfo?.locationUrl : "#"}
              className="text-primary"
            >
              {eventInfo?.locationUrl}
            </Link>
          </div>
        </div>
        {step == 1 ? (
          <TimeDateSelection
            date={date}
            enableTimeSlot={enableTimeSlot}
            handleDateChange={handleDateChange}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            prevBooking={prevBooking}
          />
        ) : (
          <UserFormInfo
            setUserName={setUserName}
            setUserEmail={setUserEmail}
            setUserNote={setUserNote}
          />
        )}
      </div>
      <div className="flex gap-3 justify-end">
        {step == 2 && (
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
        )}

        {step == 1 ? (
          <Button
            className="mt-10 float-right"
            disabled={!selectedTime || !date}
            onClick={() => setStep(step + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={!userEmail || !userName || !userNote}
            onClick={handleScheduleEvent}
          >
            Schedule
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingTimeDateSelection;
