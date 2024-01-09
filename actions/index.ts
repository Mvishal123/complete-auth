"use server";

import { loginSchema, registerSchema } from "@/schemas";
import * as z from "zod";

// to login an user
export const login = async (values: z.infer<typeof loginSchema>) => {
  const validateFields = loginSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid credentials",
    };
  }
  return { success: "Email sent" };
};

// to register an user
export const register = async (values: z.infer<typeof registerSchema>) => {
  const validateFields = registerSchema.safeParse(values);

  if (!validateFields) {
    return {
      error: "Invalid credentials",
    };
  }
  return {
    success: "Email sent",
  };
};
