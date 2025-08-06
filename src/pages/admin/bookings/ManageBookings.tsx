import { CalendarCheck2, Search, Pencil, Trash2, Eye } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Table,
} from "@/components/ui/table";

export default function Bookings() {
  // Sample bookings data for demonstration
  const bookings = [
    {
      id: 1,
      user: "Alice",
      status: "Pending",
      date: "2024-06-10",
      service: "Garden Cleanup",
    },
    {
      id: 2,
      user: "Bob",
      date: "2024-06-12",
      status: "Confirmed",
      service: "Lawn Mowing",
    },
    {
      id: 3,
      user: "Charlie",
      date: "2024-06-15",
      status: "Completed",
      service: "Tree Pruning",
    },
  ];

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-8">
      {/* Header with icon and title */}
      <div className="mb-6 flex items-center gap-3">
        <CalendarCheck2 className="text-primary h-7 w-7" />
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
      </div>

      {/* Search/filter bar */}
      <div className="mb-4 flex gap-2">
        <Input placeholder="Search bookings..." className="max-w-xs" />
        <Button aria-label="Search" variant="outline" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="default">Add Booking</Button>
      </div>

      {/* Bookings table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.user}</TableCell>
              <TableCell>{booking.service}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>
                <span
                  className={
                    booking.status === "Completed"
                      ? "text-green-600"
                      : booking.status === "Confirmed"
                        ? "text-blue-600"
                        : "text-yellow-600"
                  }
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button aria-label="View" variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button aria-label="Edit" variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button aria-label="Delete" variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
