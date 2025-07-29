import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CustomerForm from "./CustomerForm";
import { createCustomer } from "@/api/users"; // adjust path as needed
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewCustomerDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            toast.success('Customer has been saved');
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: () => {
            toast.error('Error saving customer');
        },
    });

    return (
        <>
            <Button variant="outline" size="lg" onClick={() => setOpen(true)}><Plus />Add Customer</Button>
            <CustomerForm
                mode="add"
                open={open}
                onOpenChange={setOpen}
                onSubmit={mutate}
                isPending={isPending}
            />
        </>
    );
}
