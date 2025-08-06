import React from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import { customerSchema } from "@/pages/admin/interment/customer/customer.validation";
import {
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
  FormItem,
  Form,
} from "@/components/ui/form";
import {
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";

export interface CustomerFormProps {
  open: boolean;
  initialValues?: any;
  isPending?: boolean;
  mode: CustomerFormMode;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void> | void;
}

export type CustomerFormMode = "edit" | "view" | "add";

export default function CustomerForm({
  mode,
  open,
  onSubmit,
  isPending,
  onOpenChange,
  initialValues,
}: CustomerFormProps) {
  const form = useForm<any>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues || {
      email: "",
      gender: "",
      status: "",
      address: "",
      religion: "",
      last_name: "",
      first_name: "",
      birth_date: "",
      occupation: "",
      middle_name: "",
      citizenship: "",
      contact_number: "",
    },
  });

  const handleSubmit = async (values: any) => {
    await onSubmit(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add New Customer"
              : mode === "edit"
                ? "Edit Customer"
                : "View Customer"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Click save when you're done."
              : mode === "edit"
                ? "Edit customer details and save."
                : "View customer details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-4">
              {/* 🛑 All fields are read-only in view mode */}
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="first_name"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter middle name"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="middle_name"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="last_name"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter address"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="address"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Number<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter contact number"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="contact_number"
              />
              <FormField
                render={({ field }) => {
                  const [calendarOpen, setCalendarOpen] = React.useState(false);
                  const [selectedDate, setSelectedDate] = React.useState<
                    undefined | Date
                  >(field.value ? new Date(field.value) : undefined);
                  const [month, setMonth] = React.useState<undefined | Date>(
                    selectedDate,
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
                      <FormLabel>
                        Birth Date<span className="text-red-500">*</span>
                      </FormLabel>
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
                            readOnly={mode === "view"}
                            disabled={mode === "view"}
                            value={field.value}
                          />
                          {mode !== "view" && (
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
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
                control={form.control}
                name="birth_date"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        disabled={mode === "view"}
                        value={field.value}
                      >
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
                )}
                control={form.control}
                name="gender"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Religion<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter religion"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="religion"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Citizenship<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter citizenship"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="citizenship"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Occupation<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter occupation"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="occupation"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        type="email"
                        {...field}
                        readOnly={mode === "view"}
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="email"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        disabled={mode === "view"}
                        value={field.value}
                      >
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
                )}
                control={form.control}
                name="status"
              />
            </div>
            {mode !== "view" && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  onClick={() => {
                    form.reset();
                  }}
                  disabled={isPending}
                  variant="outline"
                  type="button"
                >
                  Clear
                </Button>
                <Button disabled={isPending} type="submit">
                  {isPending
                    ? mode === "add"
                      ? "Saving..."
                      : "Updating..."
                    : mode === "add"
                      ? "Save"
                      : "Update"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
