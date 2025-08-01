import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

// Unified customer schema for both add and edit
const CustomerSchema = z.object({
    first_name: z.string().min(3, { message: "Invalid first name." }),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, { message: "Invalid last name." }),
    nickname: z.string().min(2, { message: "Invalid nickname." }),
    address: z.string().min(6, { message: "Invalid address." }),
    contact_number: z.string().min(11, { message: "Invalid contact number." }).regex(/^09\d{9}$/, { message: "Invalid contact number." }),
    birth_date: z.string().min(1, { message: "Invalid birth date." }),
    gender: z.string().min(1, { message: "Invalid gender." }),
    religion: z.string().min(1, { message: "Invalid religion." }),
    citizenship: z.string().min(1, { message: "Invalid citizenship." }),
    occupation: z.string().min(1, { message: "Invalid occupation." }),
    email: z.string().min(1, { message: "Invalid email." }).email({ message: "Invalid email address." }),
    status: z.enum(["single", "married", "widowed", "divorced", "separated"], {
        message: "Invalid status.",
    }),
});

export type CustomerFormMode = "add" | "edit";

export interface CustomerFormProps {
    mode: CustomerFormMode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues?: any;
    onSubmit: (values: any) => Promise<void> | void;
    isPending?: boolean;
}

export default function CustomerForm({ mode, open, onOpenChange, initialValues, onSubmit, isPending }: CustomerFormProps) {
    const form = useForm<any>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: initialValues || {
            first_name: "",
            middle_name: "",
            last_name: "",
            nickname: "",
            address: "",
            contact_number: "",
            birth_date: "",
            gender: "",
            religion: "",
            citizenship: "",
            occupation: "",
            email: "",
            status: ""
        }
    });

    const handleSubmit = (values: any) => {
        onSubmit(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            <FormField control={form.control} name="first_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="middle_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter middle name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="last_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="nickname" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nickname<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter nickname" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="contact_number" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="birth_date" render={({ field }) => {
                                // Local state for calendar popover and date selection
                                const [calendarOpen, setCalendarOpen] = React.useState(false);
                                const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
                                    field.value ? new Date(field.value) : undefined
                                );
                                const [month, setMonth] = React.useState<Date | undefined>(selectedDate);

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
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        const date = new Date(e.target.value);
                                                        if (!isNaN(date.getTime())) {
                                                            setSelectedDate(date);
                                                            setMonth(date);
                                                        }
                                                    }}
                                                    placeholder="Select birth date"
                                                />
                                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="date-picker"
                                                            variant="ghost"
                                                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                            type="button"
                                                            onClick={() => setCalendarOpen(true)}
                                                        >
                                                            <CalendarIcon className="size-3.5" />
                                                            <span className="sr-only">Select date</span>
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto overflow-hidden p-0"
                                                        align="end"
                                                        alignOffset={-8}
                                                        sideOffset={10}
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={selectedDate}
                                                            captionLayout="dropdown"
                                                            month={month}
                                                            onMonthChange={setMonth}
                                                            onSelect={(date) => {
                                                                setSelectedDate(date);
                                                                setMonth(date);
                                                                setCalendarOpen(false);
                                                                field.onChange(formatDateLocal(date));
                                                            }}
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
                            <FormField control={form.control} name="gender" render={({ field }) => (
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
                            )} />
                            <FormField control={form.control} name="religion" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Religion<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter religion" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="citizenship" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Citizenship<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter citizenship" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="occupation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter occupation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
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