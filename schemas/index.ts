import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
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
