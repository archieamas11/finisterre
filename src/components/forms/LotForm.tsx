import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getPlots } from "@/api/plots.api";
import React from "react";
import type { Customer } from "@/types/interment.types";
import type { plots } from "@/types/map.types";

import { getCustomers } from "@/api/customer.api";

/* ------------------------------------------------------------------ */
/* 1. Schema – customer_name -> customer_id                           */
/* ------------------------------------------------------------------ */
const LotSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    plot_id: z.string().min(1, "Plot ID is required"),
    type: z.string().min(2, "Invalid type"),
    payment_type: z.string().min(2, "Invalid payment type"),
    payment_frequency: z.string().optional(),
}).refine(
    (data) =>
        data.payment_type === "full"
            ? true
            : typeof data.payment_frequency === "string" &&
            data.payment_frequency.length >= 2,
    {
        message: "Invalid payment frequency",
        path: ["payment_frequency"],
    }
);

/* ------------------------------------------------------------------ */
/* 2. Component                                                       */
/* ------------------------------------------------------------------ */
export type LotFormMode = "add" | "edit";
export interface LotFormProps {
    mode: LotFormMode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues?: any;
    onSubmit: (values: any) => Promise<void> | void;
    isPending?: boolean;
}

export default function LotForm({
    mode,
    open,
    onOpenChange,
    initialValues,
    onSubmit,
    isPending,
}: LotFormProps) {
    /* ------------------ Form ------------------ */
    const form = useForm<z.infer<typeof LotSchema>>({
        resolver: zodResolver(LotSchema),
        defaultValues: initialValues || {
            customer_id: "",
            plot_id: "",
            type: "",
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
        getPlots().then((res) =>
            setPlots(Array.isArray(res) ? res : res?.plots || [])
        );
        getCustomers().then((res) =>
            setCustomers(Array.isArray(res) ? res : res?.customers || [])
        );
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-[700px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New Lot Owner" : "Edit Lot Owner"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Click save when you're done." : "Edit lot owner details and save."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="customer_id"
                                render={({ field }) => {
                                    // Use local state for combobox open/value, not form state
                                    const [comboOpen, setComboOpen] = React.useState(false);
                                    const [comboValue, setComboValue] = React.useState(field.value ?? "");
                                    React.useEffect(() => {
                                        setComboValue(field.value ?? "");
                                    }, [field.value]);
                                    const isEditMode = mode === "edit";
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                Customer<span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Popover open={comboOpen} onOpenChange={isEditMode ? undefined : setComboOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={comboOpen}
                                                        className="w-full justify-between"
                                                        disabled={isEditMode}
                                                    >
                                                        {comboValue
                                                            ? customers.find((c) => c.customer_id === comboValue)?.first_name +
                                                            " " +
                                                            customers.find((c) => c.customer_id === comboValue)?.last_name +
                                                            " | ID: " +
                                                            comboValue
                                                            : "Select a customer"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                {/* Only render popover content if not edit mode */}
                                                {!isEditMode && (
                                                    <PopoverContent className="w-full lg:w-80 p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search customer..." className="h-9" />
                                                            <CommandList>
                                                                <CommandEmpty>No customer found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {customers.map((c) => (
                                                                        <CommandItem
                                                                            key={c.customer_id}
                                                                            value={c.customer_id}
                                                                            onSelect={() => {
                                                                                field.onChange(c.customer_id);
                                                                                setComboValue(c.customer_id);
                                                                                setComboOpen(false);
                                                                            }}
                                                                        >
                                                                            {c.first_name} {c.last_name} | ID: {c.customer_id}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    comboValue === c.customer_id ? "opacity-100" : "opacity-0"
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
                            />
                            <FormField control={form.control} name="plot_id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plot ID<span className="text-red-500">*</span></FormLabel>
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
                                                    <SelectItem value="no-plots" disabled>No plots available</SelectItem>
                                                ) : (
                                                    plots
                                                        .filter(plot => plot.plot_id && plot.plot_id !== "")
                                                        .map(plot => (
                                                            <SelectItem key={plot.plot_id} value={String(plot.plot_id)}>
                                                                {String(plot.plot_id)}
                                                            </SelectItem>
                                                        ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="payment_type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Type<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Select payment type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="installment">Installment</SelectItem>
                                                <SelectItem value="full">One-time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="payment_frequency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Frequency<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value ?? ""}
                                            onValueChange={field.onChange}
                                            disabled={paymentType === "full"}
                                        >
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Select payment frequency" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                                <SelectItem value="annually">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (mode === "add" ? "Saving..." : "Updating...") : (mode === "add" ? "Save" : "Update")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}