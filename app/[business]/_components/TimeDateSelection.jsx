import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";
import React from "react";

function TimeDateSelection({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  enableTimeSlot,
  selectedTime,
  prevBooking,
}) {
  const chechTimeSlot = (time) => {
    return prevBooking.filter((item) => item.selectedTime == time).length > 0;
  };
  return (
    <div className="md:col-span-2 flex px-4 ">
      <div className="flex flex-col">
        <h2>Select Date and Time</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => handleDateChange(d)}
          className="rounded-md border mt-5 "
          disabled={(date) => date < new Date()}
        />
      </div>
      <div className="flex flex-col w-full overflow-auto gap-4 p-5 max-h-96 ">
        {timeSlots?.map((time, index) => (
          <Button
            key={index}
            onClick={() => setSelectedTime(time)}
            className={`border - primary text-primary ${
              time == selectedTime && "bg-primary text-white"
            } `}
            variant="outline"
            disabled={!enableTimeSlot || chechTimeSlot(time)}
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default TimeDateSelection;
