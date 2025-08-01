import { useUpsertCustomer } from '@/hooks/customer-hooks/customer.hooks';
import CustomerForm from "@/components/forms/CustomerForm";
import type { Customer } from "@/types/interment.types";

interface EditCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer: Customer;
}

export default function EditCustomerDialog({ open, onOpenChange, customer }: EditCustomerDialogProps) {
    const { mutateAsync, isPending } = useUpsertCustomer();

    async function handleSubmit(values: any) {
        const payload = {
            customer_id: customer.customer_id,
            first_name: values.first_name.trim(),
            middle_name: values.middle_name?.trim() || "",
            last_name: values.last_name.trim(),
            address: values.address.trim(),
            contact_number: values.contact_number.trim(),
            email: values.email.trim(),
            birth_date: values.birth_date ? new Date(values.birth_date).toISOString().slice(0, 10) : '',
            gender: values.gender,
            religion: values.religion?.trim() || "",
            citizenship: values.citizenship.trim(),
            status: values.status,
            occupation: values.occupation.trim(),
        };
        try {
            const result = await mutateAsync(payload);
            if ((result as any)?.success) {
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    }

    const initialValues = {
        first_name: customer.first_name || "",
        middle_name: customer.middle_name || "",
        last_name: customer.last_name || "",
        nickname: customer.nickname || "",
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
            mode="edit"
            open={open}
            onOpenChange={onOpenChange}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}