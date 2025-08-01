import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LotForm from "./LotForm";
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
        onError: () => {
            toast.error('Error saving Lot Owner');
        },
    });

    return (
        <>
            <Button variant="outline" size="lg" onClick={() => setOpen(true)}><Plus />Add Lot Owner</Button>
            <LotForm
                mode="add"
                open={open}
                onOpenChange={setOpen}
                onSubmit={mutate}
                isPending={isPending}
            />
        </>
    );
}
