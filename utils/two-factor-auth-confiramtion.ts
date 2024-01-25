import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  const confirmation = await db.twoFactorConfirmation.findUnique({
    where: {
      userId,
    },
  });

  return confirmation;
};
