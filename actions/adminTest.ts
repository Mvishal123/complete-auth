"use server"

import { getServerUserRole } from "@/lib/server-user-role";
import { UserRole } from "@prisma/client";

export const testAdminServerAction = async () => {
  const userRole = await getServerUserRole();

  if (userRole !== UserRole.ADMIN) {
    return {
      error: "No admin privelages",
    };
  }

  return {
    success: "Server action successfull",
  };
};
