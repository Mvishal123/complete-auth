import { getVerificationTokenByEmail } from "@/utils/verificaton-token";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/data";
import { getResetPasswordTokenByEmail } from "@/utils/reset-password-token";

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 1 * 60 * 60 * 1000); //1 hour from creation of token

  const isToken = await getVerificationTokenByEmail(email);

  if (!isToken) {
    const verificationToken = await db.verificationToken.create({
      data: {
        token,
        email,
        expires,
      },
    });

    return verificationToken;
  }

  // updating verification token if already exists
  const verificationToken = await db.verificationToken.update({
    where: {
      email,
    },
    data: {
      token,
      email,
      expires,
    },
  });

  return verificationToken;
};

export const generateResetPasswordToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const isToken = await getResetPasswordTokenByEmail(email);

  if (!isToken) {
    await db.resetPasswordToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return token;
  }

  await db.resetPasswordToken.update({
    data: {
      email,
      token,
      expires,
    },
    where: {
      email,
    },
  });

  return token;
};
