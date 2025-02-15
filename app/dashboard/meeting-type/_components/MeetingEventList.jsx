"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  orderBy,
} from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { app } from "@/config/FirebaseConfig";
import { Clock, Copy, MapPin, Pen, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function MeetingEventList() {
  const [eventList, setEventList] = useState([]);
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [businessInfo, setBusinessInfo] = useState();

  useEffect(() => {
    user && getEventList();
    user && BusinessInfo();
  }, [user]);
  const getEventList = async () => {
    setEventList([]);
    const q = query(
      collection(db, "MeetingEvent"),
      where("createdBy", "==", user?.email),
      orderBy("id", "desc")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setEventList((prevEvent) => [...prevEvent, doc.data()]);
    }, orderBy("id", "desc"));
  };

  const BusinessInfo = async () => {
    const docRef = doc(db, "Business", user.email);
    const docSnap = await getDoc(docRef);
    setBusinessInfo(docSnap.data());
  };

  const onDeleteMeetingEvent = async (event) => {
    await deleteDoc(doc(db, "MeetingEvent", event?.id)).then((resp) => {
      toast.success("Meeting Deleted");
      getEventList();
    });
  };

  const onCopyClickHandler = (event) => {
    const meetingEventUrl =
      process.env.NEXT_PUBLIC_BASE_URL +
      "/" +
      businessInfo?.businessName +
      "/" +
      event.id;
    navigator.clipboard.writeText(meetingEventUrl);
    toast.success("Url copied ");
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {eventList.length > 0 ? (
        eventList.map((event, index) => (
          <div
            key={index}
            className="border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3"
            style={{ borderTopColor: event?.themeColor }}
          >
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Settings className=" cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => onDeleteMeetingEvent(event)}
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h2 className="font-medium text-2xl">{event?.eventName}</h2>
            <div className="flex justify-between">
              <h2 className="flex gap-2 text-gray-500">
                <Clock />
                {event.duration} Min
              </h2>
              <h2 className="flex gap-2 text-gray-500">
                <MapPin />
                {event.location}
              </h2>
            </div>
            <hr />
            <div className="flex justify-between">
              <h2
                className="flex gap-2 text-sm items-center text-primary cursor-pointer"
                onClick={() => {
                  onCopyClickHandler(event);
                }}
              >
                <Copy className="h-4 w-4 " />
                Copy Link
              </h2>
              <Button
                className="rounded-full text-primary border-primary"
                variant="outline"
              >
                Share
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2>No event found</h2>
      )}
    </div>
  );
}

export default MeetingEventList;
