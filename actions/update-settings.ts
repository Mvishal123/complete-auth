"use server";

import { update } from "@/auth";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/server-session";
import { settingsSchema } from "@/schemas";
import { z } from "zod";

export const updateSettings = async (
  values: z.infer<typeof settingsSchema>
) => {
  const session = await getServerSession();
  if (!session) {
    return {
      error: "Session expired",
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!existingUser) {
    return {
      error: "Account does not exist",
    };
  }

  const user = await db.user.update({
    data: {
      ...values,
    },
    where: {
      id: session.userId,
    },
  });

  await update({
    user: {
      ...user,
    },
  });
  return {
    success: "Updated successfully",
  };
};
