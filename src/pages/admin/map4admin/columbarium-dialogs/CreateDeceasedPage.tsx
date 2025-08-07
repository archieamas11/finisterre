import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateDeceasedRecord } from "@/hooks/deceased-hooks/useCreateDeceasedRecord";
import { CreateDeceasedRecordDialog } from "@/pages/admin/map4admin/columbarium-dialogs/CreateDeceasedRecordDialog";

interface CreateDeceasedProps {
  lotId?: string;
  onSuccess?: () => void;
}

export default function CreateDeceased({ lotId, onSuccess }: CreateDeceasedProps) {
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useCreateDeceasedRecord();
  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      ...(lotId && { lot_id: lotId }),
    };
    mutate(payload, {
      onError: () => {
        toast.error("Error saving deceased record");
      },
      onSuccess: () => {
        setOpen(false);
        toast.success("Deceased record created successfully!");
        onSuccess?.();
      },
    });
  };

  return (
    <>
      <Button
        className="flex-1"
        onClick={() => {
          setOpen(true);
        }}
        size="sm"
      >
        Add Deceased Record
      </Button>
      <CreateDeceasedRecordDialog
        onOpenChange={setOpen}
        isPending={isPending}
        onSubmit={handleSubmit}
        open={open}
        mode="add"
      />
    </>
  );
}
