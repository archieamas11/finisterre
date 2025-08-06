import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { ChevronsUpDown, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import type { plots } from "@/types/map.types";
import type { Customer } from "@/types/interment.types";

import { cn } from "@/lib/utils";
import { getPlots } from "@/api/plots.api";
import { Button } from "@/components/ui/button";
import { getCustomers } from "@/api/customer.api";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import {
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
  FormItem,
  Form,
} from "@/components/ui/form";
import {
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
  Command,
} from "@/components/ui/command";

/* ------------------------------------------------------------------ */
/* 1. Schema – customer_name -> customer_id                           */
/* ------------------------------------------------------------------ */
const LotSchema = z
  .object({
    type: z.string().min(2, "Invalid type"),
    payment_frequency: z.string().optional(),
    plot_id: z.string().min(1, "Plot ID is required"),
    customer_id: z.string().min(1, "Customer is required"),
    payment_type: z.string().min(2, "Invalid payment type"),
  })
  .refine(
    (data) =>
      data.payment_type === "full"
        ? true
        : typeof data.payment_frequency === "string" &&
          data.payment_frequency.length >= 2,
    {
      path: ["payment_frequency"],
      message: "Invalid payment frequency",
    },
  );

export interface LotFormProps {
  open: boolean;
  mode: LotFormMode;
  initialValues?: any;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void> | void;
}
/* ------------------------------------------------------------------ */
/* 2. Component                                                       */
/* ------------------------------------------------------------------ */
export type LotFormMode = "edit" | "add";

export default function LotForm({
  mode,
  open,
  onSubmit,
  isPending,
  onOpenChange,
  initialValues,
}: LotFormProps) {
  /* ------------------ Form ------------------ */
  const form = useForm<z.infer<typeof LotSchema>>({
    resolver: zodResolver(LotSchema),
    defaultValues: initialValues || {
      type: "",
      plot_id: "",
      customer_id: "",
      payment_type: "",
      payment_frequency: "",
    },
  });

  const paymentType = form.watch("payment_type");

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
          <DialogTitle>
            {mode === "add" ? "Add New Lot Owner" : "Edit Lot Owner"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Click save when you're done."
              : "Edit lot owner details and save."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                render={({ field }) => {
                  // Use local state for combobox open/value, not form state
                  const [comboOpen, setComboOpen] = React.useState(false);
                  const [comboValue, setComboValue] = React.useState(
                    field.value ?? "",
                  );
                  React.useEffect(() => {
                    setComboValue(field.value ?? "");
                  }, [field.value]);
                  const isEditMode = mode === "edit";
                  return (
                    <FormItem>
                      <FormLabel>
                        Customer<span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover
                        onOpenChange={isEditMode ? undefined : setComboOpen}
                        open={comboOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            className="w-full justify-between"
                            aria-expanded={comboOpen}
                            disabled={isEditMode}
                            variant="outline"
                            role="combobox"
                          >
                            {comboValue
                              ? customers.find(
                                  (c) => c.customer_id === comboValue,
                                )?.first_name +
                                " " +
                                customers.find(
                                  (c) => c.customer_id === comboValue,
                                )?.last_name +
                                " | ID: " +
                                comboValue
                              : "Select a customer"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        {/* Only render popover content if not edit mode */}
                        {!isEditMode && (
                          <PopoverContent className="w-full p-0 lg:w-80">
                            <Command>
                              <CommandInput
                                placeholder="Search customer..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No customer found.</CommandEmpty>
                                <CommandGroup>
                                  {customers.map((c) => (
                                    <CommandItem
                                      onSelect={() => {
                                        field.onChange(c.customer_id);
                                        setComboValue(c.customer_id);
                                        setComboOpen(false);
                                      }}
                                      value={c.customer_id}
                                      key={c.customer_id}
                                    >
                                      {c.first_name} {c.last_name} | ID:{" "}
                                      {c.customer_id}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          comboValue === c.customer_id
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        )}
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
                control={form.control}
                name="customer_id"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Plot ID<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""} // Always provide a string value
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select plot ID" />
                        </SelectTrigger>
                        <SelectContent>
                          {plots.length === 0 ? (
                            <SelectItem value="no-plots" disabled>
                              No plots available
                            </SelectItem>
                          ) : (
                            plots
                              .filter(
                                (plot) => plot.plot_id && plot.plot_id !== "",
                              )
                              .map((plot) => (
                                <SelectItem
                                  value={String(plot.plot_id)}
                                  key={plot.plot_id}
                                >
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
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Payment Type<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="installment">
                            Installment
                          </SelectItem>
                          <SelectItem value="full">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="payment_type"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Payment Frequency<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={paymentType === "full"}
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name="payment_frequency"
                control={form.control}
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button disabled={isPending} type="submit">
                {isPending
                  ? mode === "add"
                    ? "Saving..."
                    : "Updating..."
                  : mode === "add"
                    ? "Save"
                    : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
