import { useSession } from "next-auth/react";

export const useGetClientUserRole = () => {
  const session = useSession();

  return session?.data?.user.role;
};
