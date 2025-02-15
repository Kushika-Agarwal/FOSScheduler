import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";

import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

function PreviewMeeting({ formValue }) {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState();
  useEffect(() => {
    formValue?.duration && createTimeSlot(formValue.duration);
  }, [formValue]);
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
  return (
    <div
      className="p-5 py-10 shadow-lg m-5 border-t-8"
      style={{ borderTopColor: formValue?.themeColor }}
    >
      <Image src={"/logo.svg"} alt="logo" width={100} height={100} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
        <div className="p-4 border-r">
          {/* Meeting Details  */}
          <h2>Business Name</h2>
          <h2 className="font-bold text-2xl">
            {formValue?.eventName ? formValue?.eventName : "Meeting Name"}
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <h2 className="flex gap-2">
              <Clock />
              {formValue?.duration}
            </h2>
            <h2 className="flex gap-2">
              <MapPin />
              {formValue?.location} Meeting
            </h2>
            <Link
              href={formValue?.locationUrl ? formValue?.locationUrl : "#"}
              className="text-primary"
            >
              {formValue?.locationUrl}
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 flex px-4 ">
          <div className="flex flex-col">
            <h2>Select Date and Time</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mt-5 "
              disabled={(date) => date < new Date()}
            />
          </div>
          <div
            className="flex flex-col w-full overflow-auto gap-4 p-5 max-h-96 "
            // style={{ maxHeight: "400px" }}
          >
            {timeSlots?.map((time, index) => (
              <Button
                key={index}
                className=" border-primary text-primary m"
                variant="outline"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewMeeting;
