"use server";

import { loginSchema } from "@/schemas";
import * as z from "zod";

export const login = async (value: z.infer<typeof loginSchema>) => {
  console.log("Inside server action");
};
