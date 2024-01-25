"use server";

import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/token";
import { registerSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/data";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { sendVerificationMail } from "@/lib/mail";

// to register an user
export const register = async (values: z.infer<typeof registerSchema>) => {
  const validateFields = registerSchema.safeParse(values); //backend validation

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
      name: values.name,
      password: hashedPassword,
      email: values.email,
    },
  });

  const verificationToken = await generateVerificationToken(values.email);

  await sendVerificationMail(values.email, verificationToken.token)
  return {
    success: "Verification email sent",
  };
};
