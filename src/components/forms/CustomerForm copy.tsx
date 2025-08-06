import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from "@/components/ui/form";
import { SelectTrigger, SelectContent, SelectValue, SelectItem, Select } from "@/components/ui/select";
import { DialogDescription, DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";

// Unified customer schema for both add and edit
const CustomerSchema = z.object({
    middle_name: z.string().optional(),
    gender: z.string().min(1, { message: "Invalid gender." }),
    address: z.string().min(6, { message: "Invalid address." }),
    nickname: z.string().min(2, { message: "Invalid nickname." }),
    religion: z.string().min(1, { message: "Invalid religion." }),
    last_name: z.string().min(2, { message: "Invalid last name." }),
    first_name: z.string().min(3, { message: "Invalid first name." }),
    birth_date: z.string().min(1, { message: "Invalid birth date." }),
    occupation: z.string().min(1, { message: "Invalid occupation." }),
    citizenship: z.string().min(1, { message: "Invalid citizenship." }),
    email: z.string().min(1, { message: "Invalid email." }).email({ message: "Invalid email address." }),
    status: z.enum(["single", "married", "widowed", "divorced", "separated"], {
        message: "Invalid status.",
    }),
    contact_number: z.string().min(11, { message: "Invalid contact number." }).regex(/^09\d{9}$/, { message: "Invalid contact number." }),
});

export interface CustomerFormProps {
    open: boolean;
    initialValues?: any;
    isPending?: boolean;
    mode: CustomerFormMode;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: any) => Promise<void> | void;
}

export type CustomerFormMode = "edit" | "add";

export default function CustomerForm({ mode, open, onSubmit, isPending, onOpenChange, initialValues }: CustomerFormProps) {
    const form = useForm<any>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: initialValues || {
            email: "",
            gender: "",
            status: "",
            address: "",
            nickname: "",
            religion: "",
            last_name: "",
            first_name: "",
            birth_date: "",
            occupation: "",
            middle_name: "",
            citizenship: "",
            contact_number: ""
        }
    });

    const handleSubmit = (values: any) => {
        onSubmit(values);
    };

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent className="lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New Customer" : "Edit Customer"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Click save when you're done." : "Edit customer details and save."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="first_name" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter middle name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="middle_name" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="last_name" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nickname<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter nickname" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="nickname" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="address" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="contact_number" />
                            <FormField render={({ field }) => {
                                // Local state for calendar popover and date selection
                                const [calendarOpen, setCalendarOpen] = React.useState(false);
                                const [selectedDate, setSelectedDate] = React.useState<undefined | Date>(
                                    field.value ? new Date(field.value) : undefined
                                );
                                const [month, setMonth] = React.useState<undefined | Date>(selectedDate);

                                // Helper to format date as YYYY-MM-DD in local time
                                function formatDateLocal(date?: Date) {
                                    if (!date) return "";
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                    const day = String(date.getDate()).padStart(2, "0");
                                    return `${year}-${month}-${day}`;
                                }

                                return (
                                    <FormItem>
                                        <FormLabel>Birth Date<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        const date = new Date(e.target.value);
                                                        if (!isNaN(date.getTime())) {
                                                            setSelectedDate(date);
                                                            setMonth(date);
                                                        }
                                                    }}
                                                    placeholder="Select birth date"
                                                    value={field.value}
                                                />
                                                <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                            onClick={() => { setCalendarOpen(true); }}
                                                            id="date-picker"
                                                            variant="ghost"
                                                            type="button"
                                                        >
                                                            <CalendarIcon className="size-3.5" />
                                                            <span className="sr-only">Select date</span>
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
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }} control={form.control} name="birth_date"
                            />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Select gender" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="gender" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Religion<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter religion" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="religion" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Citizenship<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter citizenship" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="citizenship" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter occupation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="occupation" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="email" />
                            <FormField render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="single">Single</SelectItem>
                                                <SelectItem value="married">Married</SelectItem>
                                                <SelectItem value="widowed">Widowed</SelectItem>
                                                <SelectItem value="divorced">Divorced</SelectItem>
                                                <SelectItem value="separated">Separated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} control={form.control} name="status" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button disabled={isPending} type="submit">
                                {isPending ? (mode === "add" ? "Saving..." : "Updating...") : (mode === "add" ? "Save" : "Update")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}