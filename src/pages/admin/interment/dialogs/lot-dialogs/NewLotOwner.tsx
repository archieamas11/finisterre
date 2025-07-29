import LotForm from "./LotForm";
import { createLotOwner } from "@/api/LotOwnerApi";
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface NewLotOwnerDialogProps {
    customer_id: string;
    first_name: string;
    last_name: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function NewLotOwnerDialog({ customer_id, first_name, last_name, open, onOpenChange }: NewLotOwnerDialogProps) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: createLotOwner,
        onSuccess: () => {
            toast.success('Lot Owner has been saved');
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['lotOwners'] });
        },
        onError: (error) => {
            toast.error('Error saving lot owner');
            console.error("MUTATION ERROR:", error);
        },
    });

    return (
        <LotForm
            mode="add"
            open={open}
            onOpenChange={onOpenChange}
            initialValues={{ customer_id, first_name, last_name }}
            onSubmit={mutate}
            isPending={isPending}
        />
    );
}
