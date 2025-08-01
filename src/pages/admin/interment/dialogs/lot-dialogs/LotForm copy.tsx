// LotForm.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { getPlots } from "@/api/plots";
import { getCustomers } from "@/api/customers";
import type { Customer, plots } from "@/types/interment.types";
import React from "react";

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

    /* ------------------ Render ------------------ */
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-[700px]">
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
                            {/* Customer ------------------------------------------------ */}
                            <FormField
                                control={form.control}
                                name="customer_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Customer<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a customer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {customers.length === 0 && (
                                                    <SelectItem disabled value="no-customers">
                                                        No customers available
                                                    </SelectItem>
                                                )}
                                                {customers.map((c) => (
                                                    <SelectItem key={c.customer_id} value={c.customer_id}>
                                                        {c.first_name} {c.last_name} | ID: {c.customer_id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Plot ---------------------------------------------------- */}
                            <FormField
                                control={form.control}
                                name="plot_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Plot ID<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select plot ID" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {plots.length === 0 && (
                                                    <SelectItem disabled value="no-plots">
                                                        No plots available
                                                    </SelectItem>
                                                )}
                                                {plots.map((p) => (
                                                    <SelectItem key={p.plot_id} value={p.plot_id}>
                                                        {p.plot_id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Payment Type ------------------------------------------- */}
                            <FormField
                                control={form.control}
                                name="payment_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Payment Type<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payment type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="installment">Installment</SelectItem>
                                                <SelectItem value="full">One-time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Payment Frequency -------------------------------------- */}
                            <FormField
                                control={form.control}
                                name="payment_frequency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Payment Frequency
                                            {paymentType !== "full" && (
                                                <span className="text-red-500">*</span>
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={paymentType === "full"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select frequency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                                <SelectItem value="annually">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending}>
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