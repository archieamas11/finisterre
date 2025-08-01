import { z } from "zod";

export const customerSchema = z.object({
  first_name: z
    .string()
    .nonempty({ message: "First name must be at least 3 characters." })
    .min(3, { message: "First name must be at least 3 characters." }),
  middle_name: z.string().optional(),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  address: z
    .string()
    .min(6, { message: "Address must be at least 6 characters." }),
  contact_number: z.string().regex(/^09\d{9}$/, {
    message:
      "Contact number must be a valid PH mobile number (e.g., 09XXXXXXXXX).",
  }),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Birth date must be in YYYY-MM-DD format.",
  }),
  gender: z.string().min(1, { message: "Gender is required." }),
  religion: z.string().min(1, { message: "Religion is required." }),
  citizenship: z.string().min(1, { message: "Citizenship is required." }),
  occupation: z.string().min(1, { message: "Occupation is required." }),
  email: z.string().email({ message: "Email must be a valid email address." }),
  status: z.enum(["single", "married", "widowed", "divorced", "separated"], {
    message:
      "Status must be one of: single, married, widowed, divorced, separated.",
  }),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
