import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarCheck, Clock, Timer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ScheduledMeetingList({ meetingList }) {
  return (
    <div>
      {meetingList &&
        meetingList.map((meeting, index) => (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{meeting?.formatDate}</AccordionTrigger>
              <AccordionContent>
                <div className="mt-5 flex flex-col gap-4">
                  <h2 className="flex gap-2">
                    <Clock />
                    {meeting?.duration}min
                  </h2>

                  <h2 className="flex gap-2">
                    <CalendarCheck />
                    {meeting.formatDate}
                  </h2>
                  <h2 className="flex gap-2">
                    <Timer />
                    {meeting.selectedTime}
                  </h2>

                  <Link
                    href={meeting?.locationUrl ? meeting?.locationUrl : "#"}
                    className="text-primary"
                  >
                    {meeting?.locationUrl}
                  </Link>
                </div>
                <Link href={meeting.locationUrl}>
                  <Button className="mt-5">Join Now</Button>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
    </div>
  );
}

export default ScheduledMeetingList;
