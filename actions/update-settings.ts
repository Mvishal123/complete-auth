"use server";

import { update } from "@/auth";
import { db } from "@/lib/db";
import { sendVerificationMail } from "@/lib/mail";
import { getServerSession } from "@/lib/server-session";
import { generateVerificationToken } from "@/lib/token";
import { settingsSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getAccountById } from "@/utils/account-details";

export const updateSettings = async (
  values: z.infer<typeof settingsSchema>
) => {
  const session = await getServerSession();
  if (!session) {
    return {
      error: "Session expired",
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!existingUser) {
    return {
      error: "Account does not exist",
    };
  }

  if (session.isOauth) {
    values.name = undefined;
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.twoFactorEnabled = undefined;
    values.role = undefined;
  } // because OAUTH accounts are already 2FA verified

  // Change email
  const hasEmailChanged = (values.email !== existingUser.email) as boolean;
  if (values.email && hasEmailChanged) {
    const existingEmail = await db.user.findFirst({
      where: {
        email: values.email,
      },
    });

    if (existingEmail) {
      return {
        error: "Email already exists",
      };
    }

    const token = await generateVerificationToken(values.email);
    const updatedUser = await db.user.update({
      where: {
        email: existingUser.email,
      },
      data: {
        email: values.email,
        emailVerified: null,
      },
    });

    console.log({ updatedUser });

    const verificationMail = await sendVerificationMail(
      values.email,
      token.token
    );

    return {
      success: "Verification mail sent",
    };
  }

  //   Change password
  if (values.password && values.newPassword) {
    const isPasswordMatch = await bcrypt.compare(
      values.password,
      existingUser.password!
    );

    if (!isPasswordMatch) {
      return {
        error: "Password incorrect",
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword!, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const user = await db.user.update({
    data: {
      ...values,
    },
    where: {
      id: session.userId,
    },
  });

  await update({
    user: {
      ...user,
    },
  });

  return {
    success: "Updated successfully",
  };
};
