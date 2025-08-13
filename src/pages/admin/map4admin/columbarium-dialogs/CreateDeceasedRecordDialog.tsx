"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";

export interface DeceasedDialogProps {
  open: boolean;
  initialValues?: any;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void> | void;
  mode?: "add" | "edit";
}

const formSchema = z.object({
  dead_fullname: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  dead_birth_date: z.string().min(1, "Birth date is required"),
  dead_date_death: z.string().min(1, "Date of death is required"),
  dead_interment: z.string().min(1, "Interment date is required"),
  dead_gender: z.enum(["Male", "Female"], { message: "Gender is required." }),
});

type FormData = z.infer<typeof formSchema>;

export function CreateDeceasedRecordDialog({ open, onOpenChange, onSubmit: propOnSubmit, initialValues, isPending = false, mode = "add" }: DeceasedDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dead_fullname: initialValues?.dead_fullname || "",
      dead_gender: (initialValues?.dead_gender as "Male" | "Female") || undefined,
      dead_birth_date: initialValues?.dead_birth_date || "",
      dead_date_death: initialValues?.dead_date_death || "",
      dead_interment: initialValues?.dead_interment || "",
    },
  });

  // 💾 Handles form submission and processes data for API
  const handleSubmit = async (values: FormData) => {
    try {
      const currentTime = new Date().toISOString();
      const deceasedId = `DEC_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
      await propOnSubmit(payload);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "➕ Create New Deceased Record" : "✏️ Edit Deceased Record"}</DialogTitle>
          <DialogDescription>{mode === "add" ? "Add a new deceased person record to the cemetery system." : "Make changes to the deceased person record."}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-auto max-w-3xl space-y-8">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="dead_fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter deceased full name" {...field} />
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
                      <FormLabel>
                        Gender<span className="text-red-500">*</span>
                      </FormLabel>
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Birth Date<span className="text-red-500">*</span>
                      </FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="Select birth date" error={!!fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="dead_date_death"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Death<span className="text-red-500">*</span>
                      </FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="Select date of death" error={!!fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="dead_interment"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Interment Date<span className="text-red-500">*</span>
                      </FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="Select interment date" error={!!fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[100px]">
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    <span>Saving...</span>
                  </div>
                ) : mode === "add" ? (
                  "Create Record"
                ) : (
                  "Update Record"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
