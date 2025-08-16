import { UserCircle, Users, MapPin } from "lucide-react";
import CustomersPage from "./CustomerPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminIntermentCustomerPage() {
  // sample data for dashboard totals
  const totalCustomers = 128;
  const totalLots = 42;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <UserCircle className="text-primary h-8 w-8" strokeWidth={2.5} />
          <h1 className="text-primary text-3xl font-bold">Customer Management</h1>
        </div>
        <p className="text-muted-foreground text-lg">View, search, and manage your customer records.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCustomers}</div>
            <p className="text-muted-foreground mt-1 text-xs">Active customers</p>
          </CardContent>
        </Card>

        {/* You can add more cards here as needed */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserCircle className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-muted-foreground mt-1 text-xs">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
            <MapPin className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalLots}</div>
            <p className="text-muted-foreground mt-1 text-xs">Available lots</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <MapPin className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">38</div>
            <p className="text-muted-foreground mt-1 text-xs">85% occupancy rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <CustomersPage />
    </div>
  );
}
