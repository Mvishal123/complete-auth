import { db } from "@/lib/db";

export const getTwoFactorTokenByEmail = async (email: string) => {
  const token = await db.twoFactorToken.findFirst({
    where: {
      email,
    },
  });

  return token;
};

export const getTwoFactorTokenByToken = async (token: string) => {
  const existingToken = await db.twoFactorToken.findFirst({
    where: {
      token,
    },
  });

  return existingToken;
};
