import React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { createCustomer } from "@/api/customer.api";
import CustomerForm from "@/pages/admin/interment/customer/CustomerForm";

export default function CreateCustomer() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomer,
  });

  const handleSubmit = async (data: any) => {
    try {
      const mutationPromise = mutateAsync(data);
      toast.promise(mutationPromise, {
        loading: "Saving customer...",
        success: "Customer saved successfully",
      });
      await mutationPromise;
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (error) {
      console.error("Customer creation failed:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Plus />
        Add Customer
      </Button>
      <CustomerForm onOpenChange={setOpen} isPending={isPending} onSubmit={handleSubmit} open={open} mode="add" />
    </>
  );
}
