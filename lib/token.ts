import { getVerificationTokenByEmail } from "@/utils/verificaton-token";
import { db } from "@/lib/db";

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
