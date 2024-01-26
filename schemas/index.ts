import { UserRole } from "@prisma/client";
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(5, { message: "Password should be a min of 5 characters long" }),
  name: z.string().min(1, { message: "username is required" }),
});

export const resetPasswordMailSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(5, { message: "Password should be a min of 5 characters long" }),
    cpassword: z
      .string()
      .min(5, { message: "Password should be a min of 5 characters long" }),
  })
  .refine(
    (values) => {
      return values.password === values.cpassword;
    },
    { message: "Passwords must match", path: ["cPassword"] }
  );

export const settingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().min(6, { message: "Minimum 6 characters required" })
    ),
    newPassword: z.optional(
      z.string().min(6, { message: "Minimum 6 characters required" })
    ),
    role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
    twoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (values) => {
      if (values.password && !values.newPassword) {
        return false;
      }
      return true;
    },
    { message: "Enter a new password to change", path: ["newPassword"] }
  )
  .refine(
    (values) => {
      if (values.newPassword && !values.password) {
        return false;
      }
      return true;
    },
    { message: "Enter the password", path: ["password"] }
  )
  .refine(
    (values) => {
      if (values.password && values.newPassword && (values.password === values.newPassword)) {
        return false;
      }

      return true;
    },
    { message: "Passwords must not match", path: ["newPassword"] }
  );
