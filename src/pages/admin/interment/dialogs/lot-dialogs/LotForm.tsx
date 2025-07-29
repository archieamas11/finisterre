import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getPlots } from "@/api/plots";
import React from "react";
import { Input } from "@/components/ui/input";

// Unified customer schema for both add and edit
const LotScheme = z.object({
    customer_id: z.string().min(1, { message: "Customer ID is required." }),
    first_name: z.string().min(1, { message: "First name is required." }),
    plot_id: z.string().min(1, { message: "Plot ID is required." }),
    type: z.string().min(2, { message: "Invalid type." }),
    payment_type: z.string().min(2, { message: "Invalid payment type." }),
    payment_frequency: z.string().optional(),
}).refine(
    (data) => {
        // Only require payment_frequency if payment_type is not "full"
        if (data.payment_type !== "full") {
            return typeof data.payment_frequency === "string" && data.payment_frequency.length >= 2;
        }
        return true;
    },
    {
        message: "Invalid payment frequency.",
        path: ["payment_frequency"],
    }
);

export type LotFormMode = "add" | "edit";

export interface LotFormProps {
    mode: LotFormMode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues?: any;
    onSubmit: (values: any) => Promise<void> | void;
    isPending?: boolean;
}

export default function LotForm({ mode, open, onOpenChange, initialValues, onSubmit, isPending }: LotFormProps) {
    const form = useForm<any>({
        resolver: zodResolver(LotScheme),
        defaultValues: initialValues || {
            customer_id: "",
            first_name: "",
            last_name: "",
            full_name: "",
            plot_id: "",
            type: "",
            payment_type: "",
            payment_frequency: "",
        }
    });

    const [paymentType, setPaymentType] = React.useState(initialValues?.payment_type || "");

    // Reset payment_frequency if payment_type changes to "full"
    React.useEffect(() => {
        if (paymentType === "full") {
            form.setValue("payment_frequency", "");
        }
    }, [paymentType, form]);

    // Store fetched plots
    const [plots, setPlots] = React.useState<any[]>([]);


    // Fetch plots when dialog opens
    React.useEffect(() => {
        if (open) {
            getPlots().then((data: any) => {
                // Ensure plots is always an array
                if (data && Array.isArray(data.plots)) {
                    setPlots(data.plots);
                } else if (Array.isArray(data)) {
                    setPlots(data);
                } else {
                    setPlots([]);
                }
                console.log(data);
            });
        }
    }, [open]);

    const handleSubmit = (values: any) => {
        onSubmit(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New Lot Owner" : "Edit Lot Owner"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Click save when you're done." : "Edit lot owner details and save."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="first_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Name<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Customer Name"
                                            value={field.value ?? ""}
                                            disabled
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
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
                                            value={field.value ?? ""}
                                            onValueChange={value => {
                                                field.onChange(value);
                                                setPaymentType(value);
                                            }}
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