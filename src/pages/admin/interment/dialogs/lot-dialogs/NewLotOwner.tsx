import LotForm from "./LotForm";
import { createLotOwner } from "@/api/LotOwnerApi";
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Customer } from "@/types/IntermentTypes";

export interface NewLotOwnerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer?: Customer;
}

export default function NewLotOwnerDialog({ open, onOpenChange, customer, }: NewLotOwnerDialogProps) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: createLotOwner,
        onSuccess: () => {
            toast.success('Lot Owner has been saved');
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['lotOwners'] });
            console.log('Lot Owner created successfully with customer:', customer);
        },
        onError: () => {
            toast.error('Error saving lot owner');
            console.log('Error saving lot owner with customer:', customer);
        },
    });

    const initialValues = customer
        ? {
            first_name: customer.first_name || "",
            last_name: customer.last_name || "",
            customer_id: customer.customer_id || "",
            full_name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
        }
        : undefined;

    return (
        <LotForm
            mode="add"
            open={open}
            onOpenChange={onOpenChange}
            initialValues={initialValues}
            onSubmit={mutate}
            isPending={isPending}
        />
    );
}
