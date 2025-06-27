import { z } from "zod";

export const loginSchema = z.object({
    symbolNo: z.string().min(1, "Symbol No. is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    confirmPw: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPw, {
    message: "Passwords do not match",
    path: ["confirmPw"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;







