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
  // 📨 Attach customerId and lot_id to the deceased record payload
  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      ...(lotId && { lot_id: lotId }),
    };
    console.log("🚀 Creating deceased record with payload:", payload);
    mutate(payload, {
      onError: (error: Error) => {
        console.error("❌ Error saving deceased record:", error);
        toast.error("Error saving deceased record");
      },
      onSuccess: () => {
        console.log("✅ Deceased record saved successfully");
        setOpen(false);
        toast.success("Deceased record created successfully!");
        onSuccess?.(); // 🔄 Call parent callback if provided
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
