import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Customer } from "@/api/customer.api";
import type { plots } from "@/types/map.types";

import { getCustomers } from "@/api/customer.api";
import { getPlots } from "@/api/plots.api";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from "@/components/ui/form";
import { SelectTrigger, SelectContent, SelectValue, SelectItem, Select } from "@/components/ui/select";

import CustomerSelect from "./CustomerSelect";

const LotSchema = z.object({
  plot_id: z.string().min(1, "Plot ID is required"),
  customer_id: z.string().min(1, "Customer is required"),
});
export interface LotFormProps {
  open: boolean;
  mode: LotFormMode;
  initialValues?: z.infer<typeof LotSchema>;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof LotSchema>) => Promise<void> | void;
}

export type LotFormMode = "edit" | "add";

export default function LotForm({ mode, open, onSubmit, isPending, onOpenChange, initialValues }: LotFormProps) {
  /* ------------------ Form ------------------ */
  const form = useForm<z.infer<typeof LotSchema>>({
    resolver: zodResolver(LotSchema),
    defaultValues: initialValues || {
      plot_id: "",
      customer_id: "",
    },
  });

  /* ------------------ Data ------------------ */
  const [plots, setPlots] = React.useState<plots[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    if (!open) return;
    getPlots().then((res) => {
      setPlots(Array.isArray(res) ? res : res?.plots || []);
    });
    getCustomers().then((res) => {
      setCustomers(Array.isArray(res) ? res : res?.customers || []);
    });
  }, [open]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex flex-col lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Lot Owner" : "Edit Lot Owner"}</DialogTitle>
          <DialogDescription>{mode === "add" ? "Click save when you're done." : "Edit lot owner details and save."}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Customer<span className="text-red-500">*</span>
                    </FormLabel>
                    <CustomerSelect customers={customers} value={String(field.value ?? "")} onChange={(v) => field.onChange(v)} disabled={mode === "edit"} />
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="customer_id"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Plot ID<span className="text-red-500">*</span>
                      <span className="text-xs text-gray-400">Please refer to map</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""} // Always provide a string value
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select plot ID" />
                        </SelectTrigger>
                        {/* 🧩 Set side="bottom" so popup always appears below the trigger */}
                        <SelectContent side="bottom" position="popper" align="start">
                          {plots.length === 0 ? (
                            <SelectItem value="no-plots" disabled>
                              No plots available
                            </SelectItem>
                          ) : (
                            plots
                              .filter((plot) => plot.plot_id && plot.plot_id !== "")
                              .map((plot) => (
                                <SelectItem value={String(plot.plot_id)} key={plot.plot_id}>
                                  {String(plot.plot_id)}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="plot_id"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button disabled={isPending} type="submit">
                {isPending ? (mode === "add" ? "Saving..." : "Updating...") : mode === "add" ? "Save" : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
