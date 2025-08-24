import { UserCircle } from "lucide-react";

import CustomersPage from "./CustomerPage";

export default function AdminIntermentCustomerPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <UserCircle className="text-primary h-7 w-7" strokeWidth={2.5} />
          <h1 className="text-primary text-3xl font-bold">Customer Management</h1>
        </div>
        <p className="text-muted-foreground text-lg">View, search, and manage your customer records.</p>
      </div>
      {/* Customers Table */}
      <CustomersPage />
    </div>
  );
}
