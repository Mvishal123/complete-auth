import { db } from "@/lib/db";

export const getResetPasswordTokenByEmail = async (email: string) => {
  const verificationToken = await db.resetPasswordToken.findFirst({
    where: {
      email,
    },
  });

  return verificationToken;
};

export const getResetPasswordTokenByToken = async (token: string) => {
  const verificationToken = await db.resetPasswordToken.findUnique({
    where: {
      token,
    },
  });

  return verificationToken;
};
