import React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { Button } from "@/components/ui/button";
import { createCustomer } from "@/api/customer.api";
import CustomerForm from "@/components/forms/CustomerForm";

export default function CreateCustomer() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    onError: () => {
      toast.error('Error saving customer');
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return (
    <>
      <Button onClick={() => { setOpen(true); }} variant="outline" size="lg"><Plus />Add Customer</Button>
      <CustomerForm
        onOpenChange={setOpen}
        isPending={isPending}
        onSubmit={mutate}
        open={open}
        mode="add"
      />
    </>
  );
}