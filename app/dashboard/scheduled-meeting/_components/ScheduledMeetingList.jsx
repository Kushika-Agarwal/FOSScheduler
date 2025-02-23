// import React from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { CalendarCheck, Clock, Timer } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// function ScheduledMeetingList({ meetingList }) {
//   return (
//     <div>
//       {meetingList &&
//         meetingList.map((meeting, index) => (
//           <Accordion key={index} type="single" collapsible>
//             <AccordionItem value="item-1">
//               <AccordionTrigger>{meeting?.formatDate}</AccordionTrigger>
//               <AccordionContent>
//                 <div className="mt-5 flex flex-col gap-4">
//                   <h2 className="flex gap-2">
//                     <Clock />
//                     {meeting?.duration}min
//                   </h2>

//                   <h2 className="flex gap-2">
//                     <CalendarCheck />
//                     {meeting?.formatDate}
//                   </h2>
//                   <h2 className="flex gap-2">
//                     <Timer />
//                     {meeting?.selectedTime}
//                   </h2>

//                   <Link
//                     href={meeting?.locationUrl ? meeting?.locationUrl : "#"}
//                     className="text-primary"
//                   >
//                     {meeting?.locationUrl}
//                   </Link>
//                 </div>
//                 <Link href={meeting?.locationUrl}>
//                   <Button className="mt-5">Join Now</Button>
//                 </Link>
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         ))}
//     </div>
//   );
// }

// export default ScheduledMeetingList;

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarCheck, Clock, Timer, Mail, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ScheduledMeetingList({ meetingList }) {
  return (
    <div>
      {meetingList &&
        meetingList.map((meeting, index) => (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <span>{meeting?.formatDate}</span>
                  <span className="text-sm text-muted-foreground">
                    {meeting?.userName || "Guest"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-5 flex flex-col gap-4">
                  <div className="p-4 bg-muted rounded-lg mb-4">
                    <h2 className="flex gap-2 items-center mb-2">
                      <User className="h-4 w-4" />
                      {meeting?.userName || "Guest"}
                    </h2>
                    <h2 className="flex gap-2 items-center">
                      <Mail className="h-4 w-4" />
                      {meeting?.userEmail || "No email provided"}
                    </h2>
                  </div>

                  <h2 className="flex gap-2 items-center">
                    <Clock className="h-4 w-4" />
                    {meeting?.duration}min
                  </h2>

                  <h2 className="flex gap-2 items-center">
                    <CalendarCheck className="h-4 w-4" />
                    {meeting?.formatDate}
                  </h2>

                  <h2 className="flex gap-2 items-center">
                    <Timer className="h-4 w-4" />
                    {meeting?.selectedTime}
                  </h2>

                  {meeting?.locationUrl && (
                    <Link
                      href={meeting.locationUrl}
                      className="text-primary hover:underline"
                    >
                      {meeting.locationUrl}
                    </Link>
                  )}
                </div>

                {meeting?.locationUrl && (
                  <Link href={meeting.locationUrl}>
                    <Button className="mt-5 w-full sm:w-auto">Join Now</Button>
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}

      {(!meetingList || meetingList.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          No scheduled meetings found
        </div>
      )}
    </div>
  );
}

export default ScheduledMeetingList;
