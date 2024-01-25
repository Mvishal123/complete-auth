import { db } from "@/lib/db";
import { getResetPasswordTokenByEmail } from "@/utils/reset-password-token";
import { getTwoFactorTokenByEmail } from "@/utils/two-factor-auth-token";
import { getVerificationTokenByEmail } from "@/utils/verificaton-token";
import crypto from "crypto";

export const generateTwoFactorVerificationToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 15 * 1000 * 60); //expires in 15mins

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (!existingToken) {
    await db.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return token;
  }

  await db.twoFactorToken.update({
    data: {
      token,
      expires,
    },
    where: {
      email,
    },
  });

  return token;
};

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
