import { UserCircle } from "lucide-react";
import CustomersPage from "./CustomerPage";

export default function AdminIntermentCustomerPage() {
  return (
    <div className="space-y-4">
      <div className="mb-5 flex flex-col">
        <div className="flex items-center gap-2">
          <UserCircle className="text-primary h-5.5 w-5.5" strokeWidth={2.8} />
          <h2 className="text-primary text-2xl font-bold">Customer Management</h2>
        </div>
        <p className="text-muted-foreground text-sm">View, search, and manage your customer records.</p>
      </div>
      <CustomersPage />
    </div>
  );
}
