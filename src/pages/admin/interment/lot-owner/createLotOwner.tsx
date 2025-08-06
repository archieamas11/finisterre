import React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { createLotOwner } from "@/api/lotOwner.api";
import LotForm from "@/pages/admin/interment/forms/LotForm";

export default function CreateLotOwner() {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: createLotOwner,
        onError: () => {
            toast.error("Error saving lot owner");
        },
        onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["lotOwners"] });
        },
    });

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                }}
                variant="outline"
                size="lg"
            >
                <Plus />
                Add Lot Owner
            </Button>
            <LotForm
                onOpenChange={setOpen}
                isPending={isPending}
                onSubmit={mutate}
                open={open}
                mode="add"
            />
        </>
    );
}
