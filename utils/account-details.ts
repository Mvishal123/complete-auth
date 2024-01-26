import { db } from "@/lib/db";

export const getAccountById = async (id: string) => {
  const account = await db.account.findFirst({
    where: {
      userId: id,
    },
  });

  return account;
};
