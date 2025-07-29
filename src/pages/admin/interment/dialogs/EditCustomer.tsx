import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { Customer } from "@/types/IntermentTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpsertCustomer } from "@/hooks/customers";
import { toast } from "sonner";

const EditCustomerSchema = z.object({
    first_name: z.string().min(1, { message: "First name is required." }),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, { message: "Last name is required." }),
    nickname: z.string().optional(),
    address: z.string().min(6, { message: "Address must be at least 6 characters long." }),
    contact_number: z.string()
        .min(11, { message: "Contact number must be 11 digits." })
        .regex(/^09\d{9}$/, { message: "Contact number must be a valid Philippine mobile number (e.g., 09XXXXXXXXX)." }),
    email: z.string().email({ message: "Invalid email address." }),
    birth_date: z.string().min(1, { message: "Birth date is required." }),
    gender: z.string().min(1, { message: "Gender is required    ." }),
    religion: z.string().optional(),
    citizenship: z.string().min(1, { message: "Citizenship is required." }),
    status: z.string().optional(),
    occupation: z.string().min(1, { message: "Occupation is required." }),
});

interface EditCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer: Customer;
}

export default function EditCustomerDialog({ open, onOpenChange, customer }: EditCustomerDialogProps) {
    const form = useForm<z.infer<typeof EditCustomerSchema>>({
        resolver: zodResolver(EditCustomerSchema),
        defaultValues: {
            first_name: customer.first_name || "",
            middle_name: customer.middle_name || "",
            last_name: customer.last_name || "",
            nickname: customer.nickname || "",
            address: customer.address || "",
            contact_number: customer.contact_number || "",
            birth_date: customer.birth_date ? customer.birth_date.slice(0, 10) : "",
            gender: customer.gender || "male",
            religion: customer.religion || "",
            citizenship: customer.citizenship || "",
            occupation: customer.occupation || "",
            email: customer.email || "",
            status: (customer.status as any) || "single"
        },
    });

    // Use React Query mutation for cache invalidation
    const { mutateAsync } = useUpsertCustomer();

    async function handleSubmit(values: z.infer<typeof EditCustomerSchema>) {
        const payload = {
            customer_id: customer.customer_id,
            first_name: values.first_name.trim(),
            middle_name: values.middle_name?.trim() || "",
            last_name: values.last_name.trim(),
            nickname: values.nickname?.trim() || "",
            address: values.address.trim(),
            contact_number: values.contact_number.trim(),
            email: values.email.trim(),
            birth_date: values.birth_date ? new Date(values.birth_date).toISOString().slice(0, 10) : '',
            gender: values.gender,
            religion: values.religion?.trim() || "",
            citizenship: values.citizenship.trim(),
            status: values.status,
            occupation: values.occupation.trim(),
        };
        try {
            const result = await mutateAsync(payload);
            if ((result as any)?.success) {
                toast.success("Customer edited successfully");
                onOpenChange(false);
            } else {
                toast.error((result as any)?.message || "Failed to edit customer: " + payload.first_name + " " + payload.last_name);
            }
        } catch (error) {
            toast.error("Failed to edit customer: " + payload.first_name + " " + payload.last_name);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
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
                                    <FormControl><Input placeholder="First Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="middle_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl><Input placeholder="Middle Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="last_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl><Input placeholder="Last Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="nickname" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nickname</FormLabel>
                                    <FormControl><Input placeholder="Nickname" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl><Input placeholder="Address" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="contact_number" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl><Input placeholder="Contact Number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="Email Address" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
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
                            <FormField control={form.control} name="birth_date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Birth Date</FormLabel>
                                    <FormControl><Input type="date" placeholder="Birth Date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
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
                                    <FormControl><Input placeholder="Religion" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="citizenship" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Citizenship</FormLabel>
                                    <FormControl><Input placeholder="Citizenship" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="occupation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl><Input placeholder="Occupation" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant="default">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
