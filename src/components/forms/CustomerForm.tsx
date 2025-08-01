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
import { customerSchema } from "@/pages/admin/interment/customer/customer.validation";

export type CustomerFormMode = "add" | "edit" | "view";

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
        resolver: zodResolver(customerSchema),
        defaultValues: initialValues || {
            first_name: "",
            middle_name: "",
            last_name: "",
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

    const handleSubmit = async (values: any) => {
        await onSubmit(values);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New Customer" : mode === "edit" ? "Edit Customer" : "View Customer"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "Click save when you're done."
                            : mode === "edit"
                                ? "Edit customer details and save."
                                : "View customer details."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            {/* 🛑 All fields are read-only in view mode */}
                            <FormField control={form.control} name="first_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="middle_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter middle name" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="last_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="contact_number" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact number" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="birth_date" render={({ field }) => {
                                const [calendarOpen, setCalendarOpen] = React.useState(false);
                                const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
                                    field.value ? new Date(field.value) : undefined
                                );
                                const [month, setMonth] = React.useState<Date | undefined>(selectedDate);
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
                                                    readOnly={mode === "view"}
                                                    disabled={mode === "view"}
                                                />
                                                {mode !== "view" && (
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
                                                )}
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
                                        <Select onValueChange={field.onChange} value={field.value} disabled={mode === "view"}>
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
                                        <Input placeholder="Enter religion" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="citizenship" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Citizenship<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter citizenship" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="occupation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter occupation" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email" {...field} readOnly={mode === "view"} disabled={mode === "view"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={mode === "view"}>
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
                        {mode !== "view" && (
                            <div className="flex justify-end pt-4 space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => form.reset()}
                                >
                                    Clear
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending
                                        ? (mode === "add" ? "Saving..." : "Updating...")
                                        : (mode === "add" ? "Save" : "Update")}
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}