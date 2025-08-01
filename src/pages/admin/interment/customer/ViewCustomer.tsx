import CustomerForm from "@/components/forms/CustomerForm";
import type { Customer } from "@/types/interment.types";

interface ViewCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer: Customer;
}

export default function ViewCustomerDialog({ open, onOpenChange, customer }: ViewCustomerDialogProps) {
    const initialValues = {
        first_name: customer.first_name || "",
        middle_name: customer.middle_name || "",
        last_name: customer.last_name || "",
        address: customer.address || "",
        contact_number: customer.contact_number || "",
        birth_date: customer.birth_date ? customer.birth_date.slice(0, 10) : "",
        gender: customer.gender || "male",
        religion: customer.religion || "",
        citizenship: customer.citizenship || "",
        occupation: customer.occupation || "",
        email: customer.email || "",
        status: customer.status || "single"
    };
    return (
        <CustomerForm
            mode="view"
            open={open}
            onOpenChange={onOpenChange}
            initialValues={initialValues}
            onSubmit={() => { }}
        />
    );
}