"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import {
  sendTwoFactorAuthenticationEmail,
  sendVerificationMail,
} from "@/lib/mail";
import {
  generateTwoFactorVerificationToken,
  generateVerificationToken,
} from "@/lib/token";
import { LOGIN_REDIRECT_URL } from "@/routes";
import { loginSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/data";
import { getTwoFactorTokenByEmail } from "@/utils/two-factor-auth-token";
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
  const { email, password, code } = validateFields.data;

  const user = await getUserByEmail(email);
  if (!user) {
    return {
      error: "Account does not exist",
    };
  }

  const isVerified = !!user.emailVerified;

  if (!isVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationMail(email, verificationToken.token); //send email
    return {
      success: "Verification email sent",
    };
  }

  const isTwoFactorAuth = user.twoFactorEnabled;
  if (isTwoFactorAuth && user) {
    if (code) {
      const existingToken = await getTwoFactorTokenByEmail(email);
      if (!existingToken) {
        return {
          error: "Invalid token",
        };
      }

      if (existingToken.token !== code) {
        return {
          error: "Invalid token",
        };
      }

      const hasExpired = existingToken.expires < new Date();
      if (hasExpired) {
        return {
          error: "Token has expired",
        };
      }

      //delete the 2FA token so that when user logins next time he/she needs to perform 2FA again
      // TODO: Make the 2FA token expiry date to 1 week rather than performing it every time
      await db.twoFactorToken.delete({
        where: {
          email,
          token: code,
        },
      });

      await db.twoFactorConfirmation.create({
        data: {
          userId: user.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorVerificationToken(email);
      await sendTwoFactorAuthenticationEmail(email, twoFactorToken);

      return {
        twoFactor: true,
      };
    }
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
