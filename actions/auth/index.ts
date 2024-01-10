"use server";

import { db } from "@/lib/db";
import { loginSchema, registerSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/data";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { LOGIN_REDIRECT_URL } from "@/routes";
import { AuthError } from "next-auth";

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

  const { email, password } = validateFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: LOGIN_REDIRECT_URL,
    });

    console.log("Sign in success");
  } catch (error) {
    console.log("ERROR:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    throw error;
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
