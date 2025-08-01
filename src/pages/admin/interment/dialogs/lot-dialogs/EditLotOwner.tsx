import { toast } from "sonner";
import { useUpsertLotOwner } from '@/hooks/LotOwner.hooks';
import LotForm from "../../../../../components/forms/LotForm";
import type { LotOwners } from "@/types/interment.types";

interface EditLotOwnerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lotOwner: LotOwners;
}

export default function EditLotOwnerDialog({ open, onOpenChange, lotOwner }: EditLotOwnerDialogProps) {
    const { mutateAsync, isPending } = useUpsertLotOwner();

    async function handleSubmit(values: any) {
        const payload = {
            lot_id: lotOwner.lot_id,
            customer_id: values.customer_id.trim(),
            plot_id: values.plot_id.trim(),
            payment_type: values.payment_type.trim(),
            payment_frequency: values.payment_frequency.trim(),
        };
        try {
            const result = await mutateAsync(payload);
            if ((result as any)?.success) {
                toast.success("Lot owner edited successfully");
                onOpenChange(false);
            } else {
                toast.error("Failed to edit lot owner: " + payload.customer_id);
            }
        } catch (error) {
            toast.error("Failed to edit lot owner: " + payload.customer_id);
        }
    }

    const initialValues = {
        customer_id: lotOwner.customer_id || "",
        plot_id: lotOwner.plot_id || "",
        payment_type: lotOwner.payment_type || "",
        payment_frequency: lotOwner.payment_frequency || "",
    };

    return (
        <LotForm
            mode="edit"
            open={open}
            onOpenChange={onOpenChange}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
