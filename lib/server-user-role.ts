import { auth } from "@/auth";

export const getServerUserRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
