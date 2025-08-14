"use client";

import { useState } from "react";
import { addDays, setHours, setMinutes, subDays } from "date-fns";

import { type CalendarEvent } from "@/components/calendar/types";
import { EventCalendar } from "@/components/calendar/event-calendar";

// Sample events data with hardcoded times
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Memorial Service - Smith Family",
    description: "Service for John Smith at Garden Chapel",
    start: subDays(new Date(), 24), // 24 days before today
    end: subDays(new Date(), 23), // 23 days before today
    allDay: true,
    color: "sky",
    location: "Garden Chapel",
  },
  {
    id: "2",
    title: "Plot Viewing Appointment",
    description: "Guided tour for the Lee family",
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0), // 1:00 PM, 9 days before
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days before
    color: "amber",
    location: "Section B Entrance",
  },
  {
    id: "3",
    title: "Cemetery Maintenance",
    description: "Quarterly groundskeeping and inspection",
    start: subDays(new Date(), 13), // 13 days before today
    end: subDays(new Date(), 13), // 13 days before today
    allDay: true,
    color: "orange",
    location: "Entire Park",
  },
  {
    id: "4",
    title: "Staff Meeting",
    description: "Weekly operations update",
    start: setMinutes(setHours(new Date(), 10), 0), // 10:00 AM today
    end: setMinutes(setHours(new Date(), 11), 0), // 11:00 AM today
    color: "sky",
    location: "Admin Office",
  },
  {
    id: "5",
    title: "Family Consultation",
    description: "Discuss pre-need arrangements with Garcia family",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0), // 12:00 PM, 1 day from now
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15), // 1:15 PM, 1 day from now
    color: "emerald",
    location: "Consultation Room 2",
  },
  {
    id: "6",
    title: "All Souls' Day Preparation",
    description: "Setup for annual remembrance event",
    start: addDays(new Date(), 3), // 3 days from now
    end: addDays(new Date(), 6), // 6 days from now
    allDay: true,
    color: "violet",
  },
  {
    id: "7",
    title: "Burial Ceremony - Tan Family",
    description: "Interment at Section C, Plot 45",
    start: setMinutes(setHours(addDays(new Date(), 4), 14), 30), // 2:30 PM, 4 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 14), 45), // 2:45 PM, 5 days from now
    color: "rose",
    location: "Section C, Plot 45",
  },
  {
    id: "8",
    title: "Staff Training",
    description: "First aid and emergency response",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0), // 9:00 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 30), // 10:30 AM, 5 days from now
    color: "orange",
    location: "Training Room",
  },
  {
    id: "9",
    title: "Headstone Installation",
    description: "Install marker for Rivera family",
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0), // 2:00 PM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 15), 30), // 3:30 PM, 5 days from now
    color: "sky",
    location: "Section D, Plot 12",
  },
  {
    id: "10",
    title: "Memorial Bench Dedication",
    description: "Ceremony for donated bench",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45), // 9:45 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 11), 0), // 11:00 AM, 5 days from now
    color: "amber",
    location: "Reflection Garden",
  },
  {
    id: "11",
    title: "Community Outreach",
    description: "Free estate planning seminar",
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0), // 10:00 AM, 9 days from now
    end: setMinutes(setHours(addDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days from now
    color: "emerald",
    location: "Event Hall",
  },
  {
    id: "12",
    title: "Remembrance Ceremony",
    description: "Annual event for families",
    start: addDays(new Date(), 17), // 17 days from now
    end: addDays(new Date(), 17), // 17 days from now
    allDay: true,
    color: "sky",
    location: "Memorial Lawn",
  },
  {
    id: "13",
    title: "Tree Planting Memorial",
    description: "Commemorative tree planting for donors",
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0), // 9:00 AM, 26 days from now
    end: setMinutes(setHours(addDays(new Date(), 27), 17), 0), // 5:00 PM, 27 days from now
    color: "rose",
    location: "North Grove",
  },
];

export default function Bookings() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <div className="">
      <EventCalendar events={events} onEventAdd={handleEventAdd} onEventUpdate={handleEventUpdate} onEventDelete={handleEventDelete} className="" />
    </div>
  );
}
