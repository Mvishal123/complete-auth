"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/data";
import { getVerificationTokenByToken } from "@/utils/verificaton-token";
import email from "next-auth/providers/email";

const verifyUser = async (token: string) => {
  if (!token) {
    return {
      error: "no token found",
    };
  }

  const isToken = await getVerificationTokenByToken(token);
  if (!isToken)
    return {
      error: "Invalid token",
    };

  const isExpired = new Date(isToken.expires) < new Date();
  if (isExpired)
    return {
      error: "Token has expired",
    };

  const isUser = await getUserByEmail(isToken.email);

  if (!isUser)
    return {
      error: "Email not found",
    };

  const isVerified = !!isUser.emailVerified;
  if (isVerified)
    return {
      success: "Email already verified",
    };

  await db.user.update({
    where: {
      email: isUser.email,
    },
    data: {
      emailVerified: new Date(),
      email: isUser.email,
    },
  });

  return {
    success: "Email verified",
  };
};

export default verifyUser;
