import React from "react";
import { toast } from "sonner";

import type { DeceasedRecords } from "@/types/interment.types";

import { Button } from "@/components/ui/button";
import { useCreateDeceasedRecord } from "@/hooks/deceased-hooks/useCreateDeceasedRecord";
import { CreateDeceasedRecordDialog } from "@/pages/admin/map4admin/columbarium-dialogs/CreateDeceasedRecordDialog";

interface CreateDeceasedProps {
  lotId?: string;
  onSuccess?: () => void;
}

export default function CreateDeceased({ lotId, onSuccess }: CreateDeceasedProps) {
  const [open, setOpen] = React.useState(false);
  const { mutateAsync, isPending } = useCreateDeceasedRecord();
  const handleSubmit = async (values: DeceasedRecords) => {
    const payload = {
      ...values,
      ...(lotId && { lot_id: lotId }),
    };
    try {
      const mutationPromise = mutateAsync(payload);
      toast.promise(mutationPromise, {
        loading: "Saving deceased record...",
        success: "Deceased record created successfully!",
        error: "Error saving deceased record",
      });
      await mutationPromise;
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Deceased record creation failed:", error);
    }
  };

  return (
    <>
      <Button className="flex-1" onClick={() => setOpen(true)} size="sm">
        Add Deceased Record
      </Button>
      <CreateDeceasedRecordDialog onOpenChange={setOpen} isPending={isPending} onSubmit={handleSubmit} open={open} mode="add" />
    </>
  );
}
