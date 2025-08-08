"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";

export interface DeceasedDialogProps {
    open: boolean;
    initialValues?: any;
    isPending?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: any) => Promise<void> | void;
    mode?: 'add' | 'edit';
}

const formSchema = z.object({
    dead_fullname: z.string()
        .min(1, "Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters"),
    dead_birth_date: z.string()
        .min(1, "Birth date is required"),
    dead_date_death: z.string()
        .min(1, "Date of death is required"),
    dead_interment: z.string()
        .min(1, "Interment date is required"),
    dead_gender: z.enum(["Male", "Female"]),
});

type FormData = z.infer<typeof formSchema>;

export function CreateDeceasedRecordDialog({
    open,
    onOpenChange,
    onSubmit: propOnSubmit,
    initialValues,
    isPending = false,
    mode = 'add'
}: DeceasedDialogProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dead_fullname: initialValues?.dead_fullname || "",
            dead_gender: initialValues?.dead_gender as "Male" | "Female" || undefined,
            dead_birth_date: initialValues?.dead_birth_date || "",
            dead_date_death: initialValues?.dead_date_death || "",
            dead_interment: initialValues?.dead_interment || "",
        },
    });

    // 💾 Handles form submission and processes data for API
    const handleSubmit = async (values: FormData) => {
        try {
            // 🔄 Generate required fields for API
            const currentTime = new Date().toISOString();
            const deceasedId = `DEC_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            // 🗓 Convert Date objects to ISO strings for API compatibility
            const payload = {
                lot_id: initialValues?.lot_id || "",
                deceased_id: deceasedId,
                dead_fullname: values.dead_fullname,
                full_name: values.dead_fullname,
                dead_gender: values.dead_gender,
                dead_birth_date: values.dead_birth_date,
                dead_date_death: values.dead_date_death,
                dead_interment: values.dead_interment,
                created_at: currentTime,
                updated_at: currentTime,
                dead_citizenship: "",
                dead_bio: "",
                dead_civil_status: "",
                dead_relationship: "",
                dead_message: "",
                dead_profile_link: "",
            };

            console.log("📤 Submitting deceased record:", payload);
            await propOnSubmit(payload);

            // 🧹 Reset form after successful submission
            form.reset();
            onOpenChange(false);
        } catch (error) {
            console.error("❌ Form submission error:", error);
            // 🚫 Let the parent component handle error display
        }
    };

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? '➕ Create New Deceased Record' : '✏️ Edit Deceased Record'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'add'
                            ? 'Add a new deceased person record to the cemetery system.'
                            : 'Make changes to the deceased person record.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 max-w-3xl mx-auto">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="dead_fullname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter deceased full name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="dead_gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="dead_birth_date"
                                    render={({ field }) => {
                                        const [calendarOpen, setCalendarOpen] = React.useState(false);
                                        const [selectedDate, setSelectedDate] = React.useState<
                                            undefined | Date
                                        >(field.value ? new Date(field.value) : undefined);
                                        const [month, setMonth] = React.useState<undefined | Date>(
                                            selectedDate
                                        );

                                        function formatDateLocal(date?: Date) {
                                            if (!date) return "";
                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, "0");
                                            const day = String(date.getDate()).padStart(2, "0");
                                            return `${year}-${month}-${day}`;
                                        }

                                        return (
                                            <FormItem>
                                                <FormLabel>Birth Date</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            onChange={(e) => {
                                                                // 🗓 Convert input string to Date and update field value
                                                                const date = new Date(e.target.value);
                                                                if (!isNaN(date.getTime())) {
                                                                    field.onChange(date);
                                                                } else {
                                                                    field.onChange(undefined);
                                                                }
                                                                setSelectedDate(date);
                                                                setMonth(date);
                                                            }}
                                                            placeholder="Select birth date"
                                                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                                        />
                                                        <Popover
                                                            onOpenChange={setCalendarOpen}
                                                            open={calendarOpen}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                                    onClick={() => {
                                                                        setCalendarOpen(true);
                                                                    }}
                                                                    id="birth-date-picker"
                                                                    variant="ghost"
                                                                    type="button"
                                                                >
                                                                    <CalendarIcon className="size-3.5" />
                                                                    <span className="sr-only">Select birth date</span>
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto overflow-hidden p-0"
                                                                alignOffset={-8}
                                                                sideOffset={10}
                                                                align="end"
                                                            >
                                                                <Calendar
                                                                    onSelect={(date) => {
                                                                        setSelectedDate(date);
                                                                        setMonth(date);
                                                                        setCalendarOpen(false);
                                                                        field.onChange(formatDateLocal(date));
                                                                    }}
                                                                    captionLayout="dropdown"
                                                                    onMonthChange={setMonth}
                                                                    selected={selectedDate}
                                                                    mode="single"
                                                                    month={month}
                                                                    disabled={(date) =>
                                                                        date > new Date() || date < new Date("1900-01-01")
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="dead_date_death"
                                    render={({ field }) => {
                                        const [calendarOpen, setCalendarOpen] = React.useState(false);
                                        const [selectedDate, setSelectedDate] = React.useState<
                                            undefined | Date
                                        >(field.value ? new Date(field.value) : undefined);
                                        const [month, setMonth] = React.useState<undefined | Date>(
                                            selectedDate
                                        );

                                        function formatDateLocal(date?: Date) {
                                            if (!date) return "";
                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, "0");
                                            const day = String(date.getDate()).padStart(2, "0");
                                            return `${year}-${month}-${day}`;
                                        }

                                        return (
                                            <FormItem>
                                                <FormLabel>Date of Death</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            onChange={(e) => {
                                                                // 🗓 Convert input string to Date and update field value
                                                                const date = new Date(e.target.value);
                                                                if (!isNaN(date.getTime())) {
                                                                    field.onChange(date);
                                                                } else {
                                                                    field.onChange(undefined);
                                                                }
                                                                setSelectedDate(date);
                                                                setMonth(date);
                                                            }}
                                                            placeholder="Select date of death"
                                                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                                        />
                                                        <Popover
                                                            onOpenChange={setCalendarOpen}
                                                            open={calendarOpen}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                                    onClick={() => {
                                                                        setCalendarOpen(true);
                                                                    }}
                                                                    id="death-date-picker"
                                                                    variant="ghost"
                                                                    type="button"
                                                                >
                                                                    <CalendarIcon className="size-3.5" />
                                                                    <span className="sr-only">Select date of death</span>
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto overflow-hidden p-0"
                                                                alignOffset={-8}
                                                                sideOffset={10}
                                                                align="end"
                                                            >
                                                                <Calendar
                                                                    onSelect={(date) => {
                                                                        setSelectedDate(date);
                                                                        setMonth(date);
                                                                        setCalendarOpen(false);
                                                                        field.onChange(formatDateLocal(date));
                                                                    }}
                                                                    captionLayout="dropdown"
                                                                    onMonthChange={setMonth}
                                                                    selected={selectedDate}
                                                                    mode="single"
                                                                    month={month}
                                                                    disabled={(date) =>
                                                                        date > new Date() || date < new Date("1900-01-01")
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="dead_interment"
                                    render={({ field }) => {
                                        const [calendarOpen, setCalendarOpen] = React.useState(false);
                                        const [selectedDate, setSelectedDate] = React.useState<
                                            undefined | Date
                                        >(field.value ? new Date(field.value) : undefined);
                                        const [month, setMonth] = React.useState<undefined | Date>(
                                            selectedDate
                                        );

                                        function formatDateLocal(date?: Date) {
                                            if (!date) return "";
                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, "0");
                                            const day = String(date.getDate()).padStart(2, "0");
                                            return `${year}-${month}-${day}`;
                                        }

                                        return (
                                            <FormItem>
                                                <FormLabel>Interment Date</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            onChange={(e) => {
                                                                // 🗓 Convert input string to Date and update field value
                                                                const date = new Date(e.target.value);
                                                                if (!isNaN(date.getTime())) {
                                                                    field.onChange(date);
                                                                } else {
                                                                    field.onChange(undefined);
                                                                }
                                                                setSelectedDate(date);
                                                                setMonth(date);
                                                            }}
                                                            placeholder="Select interment date"
                                                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                                        />
                                                        <Popover
                                                            onOpenChange={setCalendarOpen}
                                                            open={calendarOpen}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                                    onClick={() => {
                                                                        setCalendarOpen(true);
                                                                    }}
                                                                    id="interment-date-picker"
                                                                    variant="ghost"
                                                                    type="button"
                                                                >
                                                                    <CalendarIcon className="size-3.5" />
                                                                    <span className="sr-only">Select interment date</span>
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto overflow-hidden p-0"
                                                                alignOffset={-8}
                                                                sideOffset={10}
                                                                align="end"
                                                            >
                                                                <Calendar
                                                                    onSelect={(date) => {
                                                                        setSelectedDate(date);
                                                                        setMonth(date);
                                                                        setCalendarOpen(false);
                                                                        field.onChange(formatDateLocal(date));
                                                                    }}
                                                                    captionLayout="dropdown"
                                                                    onMonthChange={setMonth}
                                                                    selected={selectedDate}
                                                                    mode="single"
                                                                    month={month}
                                                                    disabled={(date) =>
                                                                        date > new Date("2030-12-31") || date < new Date("1900-01-01")
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="min-w-[100px]"
                            >
                                {isPending ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    mode === 'add' ? 'Create Record' : 'Update Record'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
