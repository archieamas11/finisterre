import type { Customer } from "@/types/interment.types";
import { toast } from "sonner";

import CustomerForm from "@/pages/admin/interment/forms/CustomerForm";
import { useUpsertCustomer } from "@/hooks/customer-hooks/customer.hooks";

interface EditCustomerDialogProps {
  open: boolean;
  customer: Customer;
  onOpenChange: (open: boolean) => void;
}

export default function EditCustomerDialog({
  open,
  customer,
  onOpenChange,
}: EditCustomerDialogProps) {
  const { isPending, mutateAsync } = useUpsertCustomer();

  async function handleSubmit(values: any) {
    const payload = {
      gender: values.gender,
      status: values.status,
      email: values.email.trim(),
      address: values.address.trim(),
      customer_id: customer.customer_id,
      last_name: values.last_name.trim(),
      first_name: values.first_name.trim(),
      occupation: values.occupation.trim(),
      citizenship: values.citizenship.trim(),
      religion: values.religion?.trim() || "",
      contact_number: values.contact_number.trim(),
      middle_name: values.middle_name?.trim() || "",
      birth_date: values.birth_date
        ? new Date(values.birth_date).toISOString().slice(0, 10)
        : "",
    };
    await toast.promise(
      mutateAsync(payload).then((result) => {
        if ((result as any)?.success) {
          onOpenChange(false);
        }
        return result;
      }),
      {
        loading: "Updating customer...",
        success: "Customer updated successfully!",
        error: "Failed to update customer.",
      },
    );
  }

  const initialValues = {
    email: customer.email || "",
    address: customer.address || "",
    nickname: customer.nickname || "",
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
      onSubmit={handleSubmit}
      isPending={isPending}
      mode="edit"
      open={open}
    />
  );
}
