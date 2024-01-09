"use server";

import { loginSchema } from "@/schemas";
import * as z from "zod";

export const login = async (value: z.infer<typeof loginSchema>) => {
  const validateFields = loginSchema.safeParse(value);

  if(!validateFields.success){
    return {
      error: "Invalid credentials"
    }
  } 
  return {success: "Email sent"}
};
