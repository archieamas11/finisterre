// ...existing code...
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomer } from "@/api/users"; // adjust path as needed
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const FormSchema = z.object({
    first_name: z.string().min(1, { message: "First name is required." }),
    middle_name: z.string().min(1, { message: "Middle name is required." }),
    last_name: z.string().min(1, { message: "Last name is required." }),
    nickname: z.string().min(1, { message: "Nickname is required." }),
    address: z.string().min(1, { message: "Address is required." }),
    contact_number: z.string().min(1, { message: "Contact number is required." }),
    birth_date: z.string().min(1, { message: "Birth date is required." }),
    gender: z.string().min(1, { message: "Gender is required." }),
    religion: z.string().min(1, { message: "Religion is required." }),
    citizenship: z.string().min(1, { message: "Citizenship is required." }),
    occupation: z.string().min(1, { message: "Occupation is required." }),
    email: z.string().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
    status: z.enum(["single", "married", "widowed", "divorced", "separated"], {
        message: "Status is required.",
    }),
});

export default function NewCustomerDialog() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema), defaultValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            nickname: "",
            address: "",
            contact_number: "",
            birth_date: "",
            gender: "male",
            religion: "",
            citizenship: "",
            occupation: "",
            email: "",
            status: "single"
        }
    });
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            toast.success('Customer has been saved');
            form.reset();
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: () => {
            toast.error('Error saving customer');
        },
    });

    const handleSubmit = (values: z.infer<typeof FormSchema>) => {
        mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg"><Plus />Add Customer</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                        Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="first_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
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
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="nickname" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nickname</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter nickname" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="contact_number" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
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
                                        <FormLabel>Birth Date</FormLabel>
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
                                                                // Update form field with formatted date string in local time
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
                                    <FormLabel>Gender</FormLabel>
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
                                    <FormLabel>Religion</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter religion" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="citizenship" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Citizenship</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter citizenship" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="occupation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter occupation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
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
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}
