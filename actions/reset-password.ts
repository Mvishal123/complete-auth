"use server";

import { db } from "@/lib/db";
import { sendResetPasswordMail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/token";
import { resetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/data";
import { getResetPasswordTokenByToken } from "@/utils/reset-password-token";
import bcrypt from "bcryptjs";

export const resetPassword = async (token: string, newPassword: string) => {
  const isToken = await getResetPasswordTokenByToken(token);
  if (!isToken) {
    return {
      error: "Invalid token",
    };
  }

  const hasExpired = new Date(isToken.expires) < new Date();
  if(hasExpired){
    return {
      error: "Token has expired"
    }
  }

  const user = await getUserByEmail(isToken.email);
  if (!user) {
    return {
      error: "Email doesn't exist",
    };
  }

  const isChangedPasswordSame = await bcrypt.compare(
    user.password!,
    newPassword
  );

  if (isChangedPasswordSame) {
    return {
      error: "Password must not match the old password",
    };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.resetPasswordToken.delete({
    where: {
      token,
    },
  });

  return {
    success: "Password changed successfully",
  };
};

export const sendResetMail = async (email: string) => {
  try {
    const token = await generateResetPasswordToken(email);
    await sendResetPasswordMail(email, token);
    return {
      success: "Email sent successfully",
    };
  } catch (error) {
    return {
      error: "Something unexpected happened",
    };
  }
};
