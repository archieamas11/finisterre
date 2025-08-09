import type { Customer } from "@/types/interment.types";

import CustomerForm from "@/pages/admin/interment/forms/CustomerForm";

interface ViewCustomerDialogProps {
  open: boolean;
  customer: Customer;
  onOpenChange: (open: boolean) => void;
}

export default function ViewCustomerDialog({
  open,
  customer,
  onOpenChange,
}: ViewCustomerDialogProps) {
  const initialValues = {
    email: customer.email || "",
    address: customer.address || "",
    gender: customer.gender || "male",
    religion: customer.religion || "",
    last_name: customer.last_name || "",
    status: customer.status || "single",
    first_name: customer.first_name || "",
    occupation: customer.occupation || "",
    middle_name: customer.middle_name || "",
    citizenship: customer.citizenship || "",
    contact_number: customer.contact_number || "",
    birth_date: customer.birth_date ? customer.birth_date.slice(0, 10) : "",
  };
  return (
    <CustomerForm
      initialValues={initialValues}
      onOpenChange={onOpenChange}
      onSubmit={() => { }}
      mode="view"
      open={open}
    />
  );
}
