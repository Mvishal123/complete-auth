"use server";

import { signIn } from "@/auth";
import { sendResendMail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { LOGIN_REDIRECT_URL } from "@/routes";
import { loginSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/data";
import { AuthError } from "next-auth";
import * as z from "zod";

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

  const isVerified = !!user.emailVerified;

  if (!isVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendResendMail(email, verificationToken.token); //send email
    return {
      success: "Verification email sent",
    };
  }

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
