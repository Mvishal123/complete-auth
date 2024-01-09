import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
  try {
    const user = db.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = db.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  } catch {
    return null;
  }
};
