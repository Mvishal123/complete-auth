import { useSession } from "next-auth/react";

export const getClientUserRole = () => {
  const session = useSession();

  return session?.data?.user.role;
};
