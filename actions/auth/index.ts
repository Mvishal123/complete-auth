"use server";

import { db } from "@/lib/db";
import { loginSchema, registerSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/data";
import * as z from "zod";
import bcrypt from "bcrypt";

// to login an user
export const login = async (values: z.infer<typeof loginSchema>) => {
  const validateFields = loginSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid credentials",
    };
  }

  const user = await getUserByEmail(values.email);
  if (!user) {
    return {
      error: "Account does not exist",
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

  const user = await getUserByEmail(values.email);
  if (user) {
    return {
      error: "Email already taken",
    };
  }

  const hashedPassword = await bcrypt.hash(values.password, 10);
  await db.user.create({
    data: {
      username: values.username,
      password: hashedPassword,
      email: values.email,
    },
  });

  return {
    success: "Email sent",
  };
};
