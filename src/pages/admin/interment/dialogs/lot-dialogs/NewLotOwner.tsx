import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LotForm from "../../../../../components/forms/LotForm";
import { createLotOwner } from "@/api/LotOwner.api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewLotOwnerDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: createLotOwner,
        onSuccess: () => {
            toast.success('Lot Owner has been saved');
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['LotOwners'] });
        },
        onError: (error) => {
            toast.error('Error saving Lot Owner');
            console.error('Mutation error:', error); // Log the error for debugging
        },
    });

    const handleSubmit = (values: any) => {
        console.log('Submitting values:', values); // Debug: Log the form values
        mutate(values);
    };

    return (
        <>
            <Button variant="outline" size="lg" onClick={() => setOpen(true)}>
                <Plus />Add Lot Owner
            </Button>
            <LotForm
                mode="add"
                open={open}
                onOpenChange={setOpen}
                onSubmit={handleSubmit} // Pass the handler
                isPending={isPending}
            />
        </>
    );
}