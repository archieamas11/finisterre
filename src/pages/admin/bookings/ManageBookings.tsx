import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Search, Eye, Pencil, Trash2, CalendarCheck2 } from "lucide-react";

export default function Bookings() {
  // Sample bookings data for demonstration
  const bookings = [
    {
      id: 1,
      user: "Alice",
      service: "Garden Cleanup",
      date: "2024-06-10",
      status: "Pending",
    },
    {
      id: 2,
      user: "Bob",
      service: "Lawn Mowing",
      date: "2024-06-12",
      status: "Confirmed",
    },
    {
      id: 3,
      user: "Charlie",
      service: "Tree Pruning",
      date: "2024-06-15",
      status: "Completed",
    },
  ];

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-8">
      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarCheck2 className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
      </div>

      {/* Search/filter bar */}
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search bookings..." className="max-w-xs" />
        <Button variant="outline" size="icon" aria-label="Search">
          <Search className="w-5 h-5" />
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
              <TableCell className="flex gap-2 justify-end">
                <Button variant="ghost" size="icon" aria-label="View">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Delete">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
